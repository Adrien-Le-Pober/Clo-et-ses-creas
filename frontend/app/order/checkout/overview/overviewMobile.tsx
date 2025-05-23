import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Button from '~/components/button';

interface CartItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface OverviewProps {
    items: CartItem[];
    totalPrice: number;
    itemsTotalPrice: number;
    shippingTotal: number;
    taxTotal: number;
    removeItem: (itemId: string) => void;
    handleIncrement: (itemId: string, quantity: number) => void;
    handleDecrement: (itemId: string, quantity: number) => void;
    handleSubmit: () => void;
}

export default function OverviewMobile({
    items,
    totalPrice,
    itemsTotalPrice,
    shippingTotal,
    taxTotal,
    removeItem,
    handleIncrement,
    handleDecrement,
    handleSubmit
}: OverviewProps) {
    return (
        <>
            {items.map((item) => (
                <div 
                    key={item.id}
                    className="border-t border-e border-s
                    mx-6 px-6 pt-2.5 pb-12
                    text-3xl"
                >
                    <div className="relative flex items-center pb-2.5">
                        <div className="h-20 w-20 bg-primary text-secondary mx-auto">Image</div>
                        <button 
                            onClick={() => removeItem(item.id)} 
                            className="absolute top-0 right-0"
                        >
                            <HighlightOffIcon className="text-2xl opacity-80"/>
                        </button>
                    </div>
                    <p className="pb-2.5">{item.productName}</p>
                    <div className="flex gap-5">
                        <div className="flex flex-col gap-2">
                            <p>Prix :</p>
                            <p>Quantité :</p>
                            <p>Sous-total :</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="ms-5">{item.unitPrice / 100} €</p>
                            <div className="flex items-center">
                                <button onClick={() => handleDecrement(item.id, item.quantity)}>
                                    <RemoveCircleOutlineIcon className="opacity-80 mb-2"/>
                                </button>
                                <span className="flex justify-center items-center w-16 h-10 text-2xl bg-primary text-secondary mx-1">
                                    {item.quantity}
                                </span>
                                <button onClick={() => handleIncrement(item.id, item.quantity)}>
                                    <AddCircleOutlineIcon className="opacity-80 mb-2"/>
                                </button>
                            </div>
                            <p className="ms-5">{item.subtotal / 100} €</p>
                        </div>
                    </div>
                </div>
            ))}

            <div className="border
                mx-6 mb-20 px-6 sm:px-14 pt-9 pb-14
                text-3xl"
            >
                <div className="flex gap-5">
                    <div className="flex flex-col">
                        <p>Sous total :</p>
                        <p>TVA :</p>
                        <p>Livraison :</p>
                        <p>Total :</p>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-end">{(itemsTotalPrice / 100).toFixed(2)} €</span>
                        <span className="text-end">{(taxTotal / 100).toFixed(2)} €</span>
                        <span className="text-end">{(shippingTotal / 100).toFixed(2)} €</span>
                        <span className="text-end">{(totalPrice / 100).toFixed(2)} €</span>
                    </div>
                </div>
                <Button text="Valider" width="w-full" margin="mt-10" customClasses='self-center' onClick={handleSubmit}/>
            </div>
        </>
    )
}