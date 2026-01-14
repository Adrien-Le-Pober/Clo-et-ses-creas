import { useEffect, useState } from "react";
import CartMobile from "~/features/cart/components/CartMobile";
import CartDesktop from "~/features/cart/components/CartDesktop";
import { useCart } from "~/features/cart/CartContext";
import { Link, useNavigate } from "react-router";
import Loader from "~/ui/Loader";

export default function CartPage() {
    const navigate = useNavigate();
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

    const handleSubmit = () => {
        navigate("/validation-commande");
    }

    if (state.loading) return <Loader/>;

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
                            handleSubmit={handleSubmit}
                        />
                    ) : (
                        <CartDesktop 
                            items={state.items}
                            totalPrice={totalPrice}
                            removeItem={removeItem} 
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </section>
            ) : (
                <div className="flex flex-col items-center gap-5">
                    <p className="text-center text-xl">Le panier est vide</p>
                    <Link to="/" className="bg-primary text-secondary py-2 text-xl rounded-lg px-3">
                        Retourner vers l'accueil
                    </Link>
                </div>
            )}
        </>
    )
}