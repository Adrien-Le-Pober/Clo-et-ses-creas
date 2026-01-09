import { useEffect } from "react";
import type { StepProps } from "../../types";
import confetti from "canvas-confetti";


export default function StepSuccess({isSuccess} : StepProps) {
    useEffect(() => {
        if (isSuccess) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
            });
        }
    }, [isSuccess]);

    return (
        <div className="flex flex-col items-center p-4">

            {isSuccess ? (
                <>
                    <h1 className="text-center text-3xl lg:text-4xl mt-16 mb-14">
                        Merci pour votre commande ! 🎉
                    </h1>
                    <div className="flex flex-col items-center gap-5 text-2xl lg:text-3xl pb-16">
                        <p className="text-center">Votre paiement a été traité avec succès.</p>
                        <p className="text-center">Un e-mail de confirmation, incluant votre facture, vous a été envoyé.</p>
                        <p className="text-center">Merci de votre confiance et à très bientôt sur Clo et ses créas !</p>
                    </div>

                </>

            ) : (
                <p className="text-yellow-600 text-xl font-semibold">En attente de validation du paiement...</p>
            )}
        </div>
    );
};
