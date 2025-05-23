import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import Button from '~/components/button';

type Props = {
    clientSecret: string|undefined;
    next: (() => void) |undefined;
    setIsSuccess?: (value: boolean) => void;
};

export const StripePaymentForm = ({ clientSecret, next, setIsSuccess }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
            setError("Le champ de carte est introuvable.");
            setIsProcessing(false);
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (result.error) {
            setError(result.error.message || 'Erreur lors du paiement.');
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            if (setIsSuccess) setIsSuccess(true);
            if (next) next();
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