import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";

import { useCart } from "~/features/cart/CartContext";
import { selectItemsSubtotal } from "~/features/cart/selectors";

import CartMobile from "~/features/cart/components/CartMobile";
import CartDesktop from "~/features/cart/components/CartDesktop";
import Loader from "~/ui/Loader";

export default function CartPage() {
    const navigate = useNavigate();
    const { order, loading, removeItem, updateItemQuantity } = useCart();

    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 1024 : false
    );

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined") {
                setIsMobile(window.innerWidth < 1024);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading) return <Loader />;

    if (!order || order.items.length === 0) {
        return (
            <>
                <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">
                    Panier d'achat
                </h1>

                <div className="flex flex-col items-center gap-5">
                    <p className="text-center text-xl">Le panier est vide</p>
                    <Link
                        to="/"
                        className="bg-primary text-secondary py-2 text-xl rounded-lg px-3"
                    >
                        Retourner vers l'accueil
                    </Link>
                </div>
            </>
        );
    }

    const items = order.items;
    const itemsSubtotal = selectItemsSubtotal(order);

    const handleSubmit = () => {
        navigate("/validation-commande");
    };

    return (
        <>
            <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">
                Panier d'achat
            </h1>

            <section>
                {isMobile ? (
                    <CartMobile
                        items={items}
                        itemsSubtotal={itemsSubtotal}
                        removeItem={removeItem}
                        updateItemQuantity={updateItemQuantity}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <CartDesktop
                        items={items}
                        itemsSubtotal={itemsSubtotal}
                        removeItem={removeItem}
                        updateItemQuantity={updateItemQuantity}
                        onSubmit={handleSubmit}
                    />
                )}
            </section>
        </>
    );
}
