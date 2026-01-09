import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Button from '~/ui/button';

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

export default function OverviewDesktop({
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
            <div className="grid grid-cols-[repeat(16,_1fr)] py-10 bg-primary text-secondary text-2xl">
                <div className="col-[1_/_span_2]"></div>
                <div className="col-[3_/_span_2]"></div>
                <div className="col-[5_/_span_4] text-center">Produit</div>
                <div className="col-[9_/_span_2] text-center">Prix</div>
                <div className="col-[11_/_span_3] text-center">Quantité</div>
                <div className="col-[14_/_span_2] text-center">Sous-total</div>
                <div className="col-[16_/_span_1]"></div>
            </div>

            {/* Liste des produits */}
            {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[repeat(16,_1fr)] py-4 border-b border-s border-e border-primary h-32">
                    <div className="col-[1_/_span_2] flex justify-center">
                        <button onClick={() => removeItem(item.id)} type="button">
                            <HighlightOffIcon className="text-2xl opacity-70"/>
                        </button>
                    </div>
                    <div className="col-[3_/_span_2]"></div>
                    <div className="col-[5_/_span_4] flex justify-center items-center text-2xl align-text-middle">
                        {item.productName}
                    </div>
                    <div className="col-[9_/_span_2] flex justify-center items-center text-center text-2xl">
                        {item.unitPrice / 100} €
                    </div>
                    <div className="col-[11_/_span_3] flex justify-center items-center text-center">
                        <button onClick={() => handleDecrement(item.id, item.quantity)} type="button">
                            <RemoveCircleOutlineIcon className="opacity-80"/>
                        </button>
                        <span className="flex justify-center items-center w-16 h-10 text-2xl bg-primary text-secondary mx-1">
                            {item.quantity}
                        </span>
                        <button onClick={() => handleIncrement(item.id, item.quantity)} type="button">
                            <AddCircleOutlineIcon className="opacity-80"/>
                        </button>
                    </div>
                    <div className="col-[14_/_span_2] flex justify-center items-center text-center text-2xl">
                        {item.subtotal / 100}€
                    </div>
                    <div className="col-[16_/_span_1]"></div>
                </div>
            ))}

            {/* Récapitulatif du panier */}
            <div className="grid grid-cols-2 text-2xl mb-16">
                <div></div>
                <div className="flex flex-col border-s border-b border-e pt-9 pb-14 px-10">
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
                    
                    <Button text="Valider" width="w-[calc(100%-80px)] max-w-[500px]" margin="mt-10" customClasses='self-center' onClick={handleSubmit} />
                </div>
            </div>
        </>
    )
}