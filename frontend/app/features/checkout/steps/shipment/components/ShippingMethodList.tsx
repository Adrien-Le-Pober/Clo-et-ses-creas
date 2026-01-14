import { useState, useEffect } from "react";
import type { ShippingMethod } from "../types";
import { fetchShippingMethods, fetchShippingMethodPrice } from "../services/shippingMethod.service";
import Loader from "~/ui/Loader";
import { useCart } from "~/features/cart/CartContext";

interface Props {
    onSelect: (code: string) => void;
}

export default function ShippingMethodList({ onSelect }: Props) {
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string | null>('mondial_relay');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { state } = useCart();

    useEffect(() => {
        const loadShippingMethods = async () => {
            if (!state.cartToken) return;
            setLoading(true);
            try {
                const methods = await fetchShippingMethods();

                // Pour chaque méthode, on récupère le prix en parallèle
                const methodsWithPrices = await Promise.all(
                    methods.map(async (method) => {
                        const price = await fetchShippingMethodPrice(method.code, state.cartToken);
                        return { ...method, price };
                    })
                );

                setShippingMethods(methodsWithPrices);
            } catch (err) {
                setError("Impossible de charger les méthodes de livraison.");
            } finally {
                setLoading(false);
            }
        };

        loadShippingMethods();
    }, [state.cartToken]);

    const handleSelection = (code: string) => {
        setSelectedMethod(code);
        onSelect(code);
    };

    if (loading) return <Loader/>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="pb-4">
            <h2 className="text-lg font-semibold mb-2">Méthode de livraison :</h2>
            {shippingMethods.map((method) => (
                <div 
                    className="bg-white rounded p-3 my-3 shadow cursor-pointer"
                    key={method.id}
                >
                    <label className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                        type="radio"
                        name="shippingMethod"
                        value={method.code}
                        checked={selectedMethod === method.code}
                        onChange={() => handleSelection(method.code)}
                        className="cursor-pointer"
                    />
                        {method.name} - {(method.price / 100).toFixed(2)} €
                    </label>
                </div>
            ))}
        </div>
    );
}
