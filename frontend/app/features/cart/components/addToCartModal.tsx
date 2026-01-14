import { useCart } from "~/features/cart/CartContext";
import { useNavigate } from "react-router";
import Button from "~/ui/Button";
import type { OrderItem } from "~/features/cart/types";

interface AddToCartModalProps {
    open: boolean;
    onClose: () => void;
    addedItem: OrderItem | null;
}

export default function AddToCartModal({
    open,
    onClose,
    addedItem,
}: AddToCartModalProps) {
    const { order } = useCart();
    const navigate = useNavigate();

    if (!open || !addedItem || !order) return null;

    const totalProducts = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={onClose}
        >
            <div
                className="bg-secondary p-6 w-96 space-y-8 relative cursor-default z-[10000]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl">Produit ajouté au panier</h2>

                    <button
                        type="button"
                        className="text-2xl"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                        Image
                    </div>

                    <div>
                        <p className="text-lg">
                            {addedItem.productName ?? "Produit"}
                        </p>
                        <p className="text-sm">
                            {addedItem.unitPrice / 100} €
                        </p>
                    </div>
                </div>

                <div className="text-md">
                    <p>
                        Il y a {totalProducts} article(s) dans votre panier.
                    </p>
                    <p>Sous-total : {order.itemsSubtotal / 100} €</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        text="Commander"
                        width="w-full"
                        onClick={() => {
                            onClose();
                            navigate("/panier");
                        }}
                    />

                    <Button
                        text="Continuer mes achats"
                        width="w-full"
                        outlined
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
