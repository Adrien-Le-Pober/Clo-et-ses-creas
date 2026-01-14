import {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";

import type { Order } from "./types";
import {
    createOrder,
    fetchOrder,
    addItemToOrder,
    removeItemFromOrder,
    updateOrderItemQuantity,
} from "./api";

interface CartContextValue {
    order: Order | null;
    loading: boolean;
    addItem: (variant: string, quantity?: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_TOKEN_KEY = "cart_token";

export function CartProvider({ children }: PropsWithChildren) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        bootstrapCart();
    }, []);

    async function bootstrapCart() {
        setLoading(true);
        const token = localStorage.getItem(CART_TOKEN_KEY);

        try {
            if (token) {
                const existingOrder = await fetchOrder(token);
                setOrder(existingOrder);
                return;
            }
        } catch {
            localStorage.removeItem(CART_TOKEN_KEY);
        } finally {
            setLoading(false);
        }

        const newOrder = await createOrder();
        localStorage.setItem(CART_TOKEN_KEY, newOrder.tokenValue);
        setOrder(newOrder);
    }

    async function refresh() {
        if (!order) return;
        setOrder(await fetchOrder(order.tokenValue));
    }

    async function addItem(variant: string, quantity = 1) {
        if (!order) return;
        setLoading(true);
        const updated = await addItemToOrder(
            order.tokenValue,
            variant,
            quantity
        );
        setOrder(updated);
        setLoading(false);
    }

    async function removeItem(itemId: number) {
        if (!order) return;
        setLoading(true);
        const updated = await removeItemFromOrder(
            order.tokenValue,
            itemId
        );
        setOrder(updated);
        setLoading(false);
    }

    async function updateItemQuantity(itemId: number, quantity: number) {
        if (!order) return;
        setLoading(true);
        const updated = await updateOrderItemQuantity(
            order.tokenValue,
            itemId,
            quantity
        );
        setOrder(updated);
        setLoading(false);
    }

    return (
        <CartContext.Provider
            value={{
                order,
                loading,
                addItem,
                removeItem,
                updateItemQuantity,
                refresh,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within CartProvider");
    }
    return ctx;
}