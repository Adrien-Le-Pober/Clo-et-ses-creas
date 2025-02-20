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

interface CartProps {
    items: CartItem[];
    totalPrice: number;
    removeItem: (itemId: string) => void;
    handleIncrement: (itemId: string, quantity: number) => void;
    handleDecrement: (itemId: string, quantity: number) => void;
}

export default function CartMobile({        
    items,
    totalPrice,
    removeItem,
    handleIncrement,
    handleDecrement
}: CartProps) {
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
                    <p className="pb-2.5">Prix : {item.unitPrice / 100} €</p>
                    <div className="flex items-center pb-2.5">
                        <p className="me-2">Quantité : </p>
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
                    <p>Sous-total : {item.subtotal / 100} €</p>
                </div>
            ))}

            <div className="border
                mx-6 mb-20 px-6 sm:px-14 pt-9 pb-14
                text-3xl"
            >
                <p>Total : {totalPrice / 100} €</p>
                <Button text="Valider" width="w-full" margin="mt-10" customClasses='self-center'/>
            </div>
        </>
    )
}