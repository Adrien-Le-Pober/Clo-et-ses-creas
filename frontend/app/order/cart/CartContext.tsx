import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

interface CartItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface CartState {
    cartToken: string | null;
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

type CartAction =
    | { type: "SET_CART_TOKEN"; payload: string }
    | { type: "SET_ITEMS"; payload: CartItem[] }
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_ITEM"; payload: { id: string; quantity: number, subtotal: number } }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    addItem: (productVariantCode: string, quantity?: number) => Promise<void>;
    removeItem: (itemCode: string) => Promise<void>;
    updateItemQuantity: (itemCode: string, quantity: number) => Promise<void>;
    updateCart: (updateData: Partial<{ email: string, billingAddress: object, shippingAddress: object, couponCode: string }>) => Promise<void>;
} | undefined>(undefined);

const apiURI = import.meta.env.VITE_API_URI;

const initialState: CartState = {
    cartToken: null,
    items: [],
    loading: false,
    error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "SET_CART_TOKEN":
            if (typeof window !== "undefined") {
                localStorage.setItem("cartToken", action.payload);
            }
            return { ...state, cartToken: action.payload };

        case "SET_ITEMS":
            return { ...state, items: action.payload };

        case "ADD_ITEM":
            return { ...state, items: [...state.items, action.payload] };

        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id 
                        ? { ...item, quantity: action.payload.quantity, subtotal: action.payload.subtotal }
                        : item
                ),
            };

        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        const fetchCart = async () => {
            dispatch({ type: "SET_LOADING", payload: true });

            let cartToken = localStorage.getItem("cartToken");

            if (cartToken && !state.cartToken) {
                dispatch({ type: "SET_CART_TOKEN", payload: cartToken });
            }

            if (!cartToken) {
                try {
                    const { data } = await axios.post(`${apiURI}shop/orders`, {}, {
                        headers: { "Content-Type": "application/ld+json" },
                    });
                    cartToken = data.tokenValue;
                    if (cartToken) {
                        dispatch({ type: "SET_CART_TOKEN", payload: cartToken });
                    }
                } catch (error) {
                    dispatch({ type: "SET_ERROR", payload: "Impossible de créer un panier." });
                    return;
                }
            }

            try {
                const { data } = await axios.get(`${apiURI}shop/orders/${cartToken}`);
                dispatch({ type: "SET_ITEMS", payload: data.items || [] });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Impossible de charger le panier." });
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        fetchCart();
    }, []);

    const addItem = async (productVariantCode: string, quantity: number = 1) => {
        try {
            let cartToken = state.cartToken;
            if (!cartToken) return;
    
            const { data } = await axios.post(`${apiURI}shop/orders/${cartToken}/items`, { 
                productVariant: productVariantCode, 
                quantity 
            });
    
            dispatch({ type: "SET_ITEMS", payload: data.items || [] });
        } catch (error: any) {
            const errorMessage = error.response?.data?.description || "";
            
            if (error.response?.status === 500 && errorMessage.includes("Cart with given token has not been found")) {
                try {
                    const { data } = await axios.post(`${apiURI}shop/orders`, {}, {
                        headers: { "Content-Type": "application/ld+json" },
                    });
    
                    const newCartToken = data.tokenValue;
    
                    if (newCartToken) {
                        dispatch({ type: "SET_CART_TOKEN", payload: newCartToken });
    
                        const { data: newData } = await axios.post(`${apiURI}shop/orders/${newCartToken}/items`, { 
                            productVariant: productVariantCode, 
                            quantity 
                        });
    
                        dispatch({ type: "SET_ITEMS", payload: newData.items || [] });
                    }
                } catch (createError) {
                    dispatch({ type: "SET_ERROR", payload: "Impossible de recréer le panier." });
                }
            } else {
                dispatch({ type: "SET_ERROR", payload: "Erreur lors de l'ajout au panier." });
            }
        }
    };
    

    const removeItem = async (itemId: string) => {
        try {
            if (!state.cartToken) return;

            await axios.delete(`${apiURI}shop/orders/${state.cartToken}/items/${itemId}`);

            dispatch({ type: "REMOVE_ITEM", payload: itemId });
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Erreur lors de la suppression." });
        }
    };

    const updateItemQuantity = async (itemId: string, quantity: number) => {
        try {
            if (!state.cartToken) return;

            const { data } = await axios.patch(`${apiURI}shop/orders/${state.cartToken}/items/${itemId}`,
                { quantity },
                { headers: { "Content-Type": "application/merge-patch+json" } }
            );
            
            const updatedItem = data.items.find((item: CartItem) => item.id === itemId);
            if (!updatedItem) return;

            dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, quantity, subtotal: updatedItem.subtotal } });
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Erreur lors de la mise à jour." });
        }
    };

    const updateCart = async (updateData: Partial<{ email: string, billingAddress: object, shippingAddress: object, couponCode: string }>) => {
        try {
            if (!state.cartToken) return;
    
            const { data } = await axios.get(`${apiURI}shop/orders/${state.cartToken}`);
    
            const updatedOrder = {
                email: updateData.email || data.email,
                billingAddress: updateData.billingAddress || data.billingAddress,
                shippingAddress: updateData.shippingAddress || data.shippingAddress,
                couponCode: updateData.couponCode || data.couponCode,
            };
    
            await axios.put(`${apiURI}shop/orders/${state.cartToken}`, updatedOrder, {
                headers: { "Content-Type": "application/ld+json" },
            });
    
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Erreur lors de la mise à jour du panier." });
        }
    };
    

    return (
        <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateItemQuantity, updateCart }}>
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart doit être utilisé dans un CartProvider");
    }
    return context;
}
