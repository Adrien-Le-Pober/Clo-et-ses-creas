import type { StepProps } from "./interfaces/stepProps";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from "./payment/stripePaymentForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../cart/CartContext";
import SelectButton from "~/components/selectButton";
import Loader from "~/components/loader";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StepPayment({ onNext, setIsSuccess, setIsStepLoading }: StepProps) {
    const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
    const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
    const { state, getCart } = useCart();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!state.cartToken) return;

        const loadData = async () => {
            try {
                await Promise.all([
                    fetchPaymentMethods(),
                    createPaymentIntent()
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [state.cartToken]);

    useEffect(() => {
        setIsStepLoading?.(isLoading);
    }, [isLoading]);

    const fetchPaymentMethods = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URI}shop/payment-methods`);
            setPaymentMethodList(data['hydra:member'] || []);
            console.log(data['hydra:member']);
        } catch (error) {
            console.error('Erreur lors de la récupération des méthodes de paiement', error);
        }
    };

    const createPaymentIntent = async () => {
        try {
            const cart = await getCart();

            if (!cart?.total || !cart?.customer?.email
            ) {
                throw new Error("Données du panier manquantes.");
            }

            const { data } = await axios.post(`${import.meta.env.VITE_API_URI}payment-intent`, {
                amount: cart.total,
                email: cart.customer.email,
                orderNumber: state.cartToken,
            });

            setClientSecret(data.clientSecret);
        } catch (error) {
            console.error('Erreur lors de la création de la PaymentIntent', error);
        }
    };

    const formatPaymentLabel = (name: string) => {
        switch (name) {
            case "Stripe":
                return "Carte bancaire - Stripe";
            default:
                return name;
        }
    };

    const paymentOptions = paymentMethodList.map(method => ({
        value: method.code,
        label: formatPaymentLabel(method.name),
    }));

    if (isLoading || !clientSecret) return <Loader />

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">Paiement</h1>
            <SelectButton 
                label="Choisir un moyen de paiement"
                options={paymentOptions}
                width="w-full lg:w-96"
                customWrapperClasses="mb-5"
                customOptionClasses="bg-secondary text-primary"
                outlined={true}
                onChange={(value) => setSelectedPaymentMethod(value)}
            />
            {selectedPaymentMethod == 'stripe' && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm 
                        clientSecret={clientSecret}
                        next={onNext}
                        setIsSuccess={setIsSuccess}
                        selectedPaymentMethod={selectedPaymentMethod}
                    />
                </Elements>
            )}
        </div>
    );
};
