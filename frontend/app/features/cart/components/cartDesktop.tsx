import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import Button from "~/ui/Button";
import type { OrderItem } from "../types";

interface CartDesktopProps {
    items: OrderItem[];
    itemsSubtotal: number;
    removeItem: (itemId: number) => void;
    updateItemQuantity: (itemId: number, quantity: number) => void;
    onSubmit: () => void;
}

export default function CartDesktop({
    items,
    itemsSubtotal,
    removeItem,
    updateItemQuantity,
    onSubmit,
}: CartDesktopProps) {
    return (
        <>
            {/* Header */}
            <div className="grid grid-cols-[repeat(16,_1fr)] py-10 bg-primary text-secondary text-2xl">
                <div className="col-[5_/_span_4] text-center">Produit</div>
                <div className="col-[9_/_span_2] text-center">Prix</div>
                <div className="col-[11_/_span_3] text-center">Quantité</div>
                <div className="col-[14_/_span_2] text-center">Sous-total</div>
            </div>

            {/* Items */}
            {items.map(item => (
                <div
                    key={item.id}
                    className="grid grid-cols-[repeat(16,_1fr)] py-4 border-b border-primary h-32"
                >
                    <div className="col-[1_/_span_2] flex justify-center">
                        <button onClick={() => removeItem(item.id)}>
                            <HighlightOffIcon className="text-2xl opacity-70" />
                        </button>
                    </div>

                    <div className="col-[5_/_span_4] flex items-center justify-center text-2xl">
                        {item.productName}
                    </div>

                    <div className="col-[9_/_span_2] flex items-center justify-center text-2xl">
                        {item.unitPrice / 100} €
                    </div>

                    <div className="col-[11_/_span_3] flex items-center justify-center">
                        <button
                            onClick={() =>
                                item.quantity > 1 &&
                                updateItemQuantity(item.id, item.quantity - 1)
                            }
                        >
                            <RemoveCircleOutlineIcon />
                        </button>

                        <span className="w-16 text-center text-2xl">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                            }
                        >
                            <AddCircleOutlineIcon />
                        </button>
                    </div>

                    <div className="col-[14_/_span_2] flex items-center justify-center text-2xl">
                        {item.total / 100} €
                    </div>
                </div>
            ))}

            {/* Summary */}
            <div className="grid grid-cols-2 text-2xl mb-16">
                <div className="flex flex-col border pt-9 pb-14 px-10">
                    <p>Total : {itemsSubtotal / 100} €</p>
                    <Button
                        text="Valider"
                        width="w-full"
                        margin="mt-10"
                        onClick={onSubmit}
                    />
                </div>
            </div>
        </>
    );
}