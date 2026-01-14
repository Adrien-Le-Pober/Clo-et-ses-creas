import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
import Button from '~/ui/Button';
import { useCart } from '~/features/cart/CartContext';

type Props = {
    clientSecret: string|undefined;
    next: (() => void) |undefined;
    setIsSuccess?: (value: boolean) => void;
    selectedPaymentMethod?: string;
};

export const StripePaymentForm = ({ clientSecret, next, setIsSuccess, selectedPaymentMethod }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getCart, state, resetCart } = useCart();

    const handleSubmit = async (e: React.FormEvent) => {
        resetCart();
        e.preventDefault();
        if (!stripe || !elements || !clientSecret || !selectedPaymentMethod) return;

        setIsProcessing(true);
        setError(null);

        try {
            const cart = await getCart();
            const payment = cart?.payments?.[0];

            if (!payment?.id) {
                throw new Error("Aucun paiement associé à cette commande.");
            }

            await axios.patch(`${import.meta.env.VITE_API_URI}shop/orders/${state.cartToken}/payments/${payment.id}`,
            {
                paymentMethod: `${import.meta.env.VITE_API_URI}shop/payment-methods/${selectedPaymentMethod}`
            },
            {
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
            }
            );

            // Paiement Stripe
            const cardElement = elements.getElement(CardNumberElement);
            if (!cardElement) {
                throw new Error("Le champ de carte est introuvable.");
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (result.error) {
                setError(result.error.message || 'Erreur lors du paiement.');
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {

                await axios.patch(`${import.meta.env.VITE_API_URI}shop/orders/${state.cartToken}/complete`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/merge-patch+json",
                        },
                    }
                );

                await axios.post(`${import.meta.env.VITE_API_URI}mark-payment-completed`, {
                    paymentId: payment.id,
                });

                await resetCart();

                setIsSuccess?.(true);
                next?.();
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Une erreur est survenue.");
        }

        setIsProcessing(false);
    };

    const stripeStyle = {
        base: {
            fontSize: '16px',
            color: '#852525',
            '::placeholder': {
                color: '#852525',
            },
        },
        invalid: {
            color: '#852525',
        },
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded-xl w-full lg:w-96 p-5 shadow-lg mb-5">
            <div className="space-y-4">
                <label className="block">
                    <span className="text-sm text-gray-600">Numéro de carte</span>
                    <div className="border rounded-lg p-2">
                        <CardNumberElement options={{ style: stripeStyle }} />
                    </div>
                </label>

                <div className="flex justify-between">
                    <label className="block w-28">
                        <span className="text-sm text-gray-600">Date d'expiration</span>
                        <div className="border rounded-lg p-2">
                            <CardExpiryElement options={{ style: stripeStyle }} />
                        </div>
                    </label>

                    <label className="block w-28">
                        <span className="text-sm text-gray-600">CVC</span>
                        <div className="border rounded-lg p-2">
                            <CardCvcElement options={{ style: stripeStyle }} />
                        </div>
                    </label>
                </div>
                {error && <p className="text-red-600">{error}</p>}
            </div>

            <Button 
                type="submit"
                text="Valider"
                width="w-full"
                margin="mt-10"
                customClasses='self-center'
                onClick={handleSubmit}
                disabled={!stripe || isProcessing}
            />
        </form>
    );
};