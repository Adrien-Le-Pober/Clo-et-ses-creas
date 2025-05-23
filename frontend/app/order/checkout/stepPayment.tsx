import type { StepProps } from "./interfaces/stepProps";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from "./payment/stripePaymentForm";
import { useEffect, useState } from "react";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StepPayment({ onNext, setIsSuccess }: StepProps) {
    const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URI}payment-intent`, {
                    amount: 4900, // en centimes
                    email: 'client@example.com',
                    orderId: 'XYZ123',
                });

                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Erreur lors de la création de la PaymentIntent', error);
            }
        };

        createPaymentIntent();
    }, []);

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">Paiement</h1>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm clientSecret={clientSecret} next={onNext} setIsSuccess={setIsSuccess}/>
            </Elements>
        </div>
    );
};
