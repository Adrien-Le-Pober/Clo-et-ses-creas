import { useEffect, useState } from "react";
import CartMobile from "./cartMobile";
import CartDesktop from "./cartDesktop";
import { useCart } from "./CartContext";

export default function CartPage() {
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 1024 : false);
    const { state, removeItem, updateItemQuantity } = useCart();

    const totalPrice = state.items.reduce((acc, item) => acc + item.subtotal, 0);

    useEffect(() => {
        const handleResize = () => {
            typeof window !== "undefined" && setIsMobile(window.innerWidth < 1024);
        };

        typeof window !== "undefined" && window.addEventListener("resize", handleResize);
        
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    const handleIncrement = (itemId: string, quantity: number) => {
        const newQuantity = quantity + 1;
        updateItemQuantity(itemId, newQuantity);
    };

    const handleDecrement = (itemId: string, quantity: number) => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            updateItemQuantity(itemId, newQuantity);
        }
    };

    console.log(state);

    return (
        <>
            <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">Panier d'achat</h1>
            {state.items.length > 0 ? (
                <section>
                    {isMobile ? (
                        <CartMobile
                            items={state.items}
                            totalPrice={totalPrice}
                            removeItem={removeItem} 
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                        />
                    ) : (
                        <CartDesktop 
                            items={state.items}
                            totalPrice={totalPrice}
                            removeItem={removeItem} 
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                        />
                    )}
                </section>
            ) : (
                <p className="text-center text-xl">Le panier est vide</p>
            )}
        </>
    )
}