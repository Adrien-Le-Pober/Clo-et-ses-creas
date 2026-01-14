import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import Button from "~/ui/Button";
import type { OrderItem } from "../types";

interface CartMobileProps {
    items: OrderItem[];
    itemsSubtotal: number;
    removeItem: (itemId: number) => void;
    updateItemQuantity: (itemId: number, quantity: number) => void;
    onSubmit: () => void;
}

export default function CartMobile({
    items,
    itemsSubtotal,
    removeItem,
    updateItemQuantity,
    onSubmit,
}: CartMobileProps) {
    return (
        <>
            {items.map(item => (
                <div
                    key={item.id}
                    className="border mx-6 px-6 pt-4 pb-10 text-3xl"
                >
                    <div className="relative pb-4">
                        <button
                            className="absolute right-0"
                            onClick={() => removeItem(item.id)}
                        >
                            <HighlightOffIcon />
                        </button>
                    </div>

                    <p>{item.productName}</p>
                    <p>Prix : {item.unitPrice / 100} €</p>

                    <div className="flex items-center py-4">
                        <button
                            onClick={() =>
                                item.quantity > 1 &&
                                updateItemQuantity(item.id, item.quantity - 1)
                            }
                        >
                            <RemoveCircleOutlineIcon />
                        </button>

                        <span className="mx-4">{item.quantity}</span>

                        <button
                            onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                            }
                        >
                            <AddCircleOutlineIcon />
                        </button>
                    </div>

                    <p>Sous-total : {item.total / 100} €</p>
                </div>
            ))}

            <div className="border mx-6 mb-20 px-6 pt-9 pb-14 text-3xl">
                <p>Total : {itemsSubtotal / 100} €</p>
                <Button
                    text="Valider"
                    width="w-full"
                    margin="mt-10"
                    onClick={onSubmit}
                />
            </div>
        </>
    );
}
