import { useCart } from "~/order/cart/CartContext";
import { useNavigate } from "react-router";
import Button from "./button";

export default function AddToCartModal() {
    const { state, dispatch } = useCart();
    const navigate = useNavigate();

    const item = state.lastAddedItem;

    if (!item) return null;

    const close = () => {
        dispatch({ type: "SET_LAST_ADDED_ITEM", payload: null });
    };

    const totalProducts = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = state.items.reduce((acc, i) => acc + i.subtotal, 0);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            onClick={close}
        >
            <div 
                className="bg-secondary p-6 w-96 space-y-8 relative cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl">Produit ajouté au panier</h2>

                    <button 
                        className="text-2xl"
                        onClick={close}
                    >×</button>
                </div>

                <div className="flex gap-4">
                    <img 
                        src={item.image ?? ""} 
                        className="w-20 h-20 object-cover"
                    />
                    <div>
                        <p className="text-lg">{item.productName}</p>
                        <p className="text-sm">{item.unitPrice / 100} €</p>
                    </div>
                </div>

                <div className="text-md">
                    <p>Il y a {totalProducts} article(s) dans votre panier.</p>
                    <p>Sous-total : {subtotal / 100} €</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        text="Commander"
                        type="button"
                        width="w-100"
                        onClick={() => {
                            close();
                            navigate("/panier");
                        }}
                    />

                    <Button
                        text="Continuer mes achats"
                        type="button"
                        width="w-100"
                        outlined={true}
                        onClick={close}
                    />
                </div>
            </div>
        </div>
    );
}