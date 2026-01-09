import type { StepProps } from "../types";
import { useCart } from "../../cart/CartContext";
import { useEffect, useState } from "react";
import Loader from "~/ui/loader";
import OverviewMobile from "./overviewMobile";
import OverviewDesktop from "./overviewDesktop";
import { Link } from "react-router";

export default function StepOverview({ onNext }: StepProps) {
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 1024 : false);
    const { state, removeItem, updateItemQuantity, getCart } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);
    const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
    const [taxTotal, setTaxTotal] = useState(0);
    const [shippingTotal, setShippingTotal] = useState(0);

    useEffect(() => {
        if (!state.cartToken) return;
        fetchCartPrices();
    }, [state.cartToken]);

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

    const handleIncrement = async (itemId: string, quantity: number) => {
        const newQuantity = quantity + 1;
        await updateItemQuantity(itemId, newQuantity);
        await fetchCartPrices(); // Refresh totals
    };

    const handleDecrement = async (itemId: string, quantity: number) => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            await updateItemQuantity(itemId, newQuantity);
            await fetchCartPrices(); // Refresh totals
        }
    };

    const handleRemove = async (itemId: string) => {
        await removeItem(itemId);
        await fetchCartPrices(); // Refresh totals
    };

    const fetchCartPrices = async () => {
        const cart = await getCart();
        setTotalPrice(cart.total);
        setItemsTotalPrice(cart.itemsTotal);
        setTaxTotal(cart.taxTotal);
        setShippingTotal(cart.shippingTotal);
    };

    const handleSubmit = () => {
        if (onNext) onNext();
    }

    if (state.loading) return <Loader/>;

    return (
        <>
            <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">Récapitulatif du panier</h1>
            {state.items.length > 0 ? (
                <section>
                    {isMobile ? (
                        <OverviewMobile
                            items={state.items}
                            totalPrice={totalPrice}
                            itemsTotalPrice={itemsTotalPrice}
                            shippingTotal={shippingTotal}
                            taxTotal={taxTotal}
                            removeItem={handleRemove}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                            handleSubmit={handleSubmit}
                        />
                    ) : (
                        <OverviewDesktop 
                            items={state.items}
                            totalPrice={totalPrice}
                            itemsTotalPrice={itemsTotalPrice}
                            shippingTotal={shippingTotal}
                            taxTotal={taxTotal}
                            removeItem={handleRemove}
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
};