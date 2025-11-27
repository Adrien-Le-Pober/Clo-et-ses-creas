import { useEffect, useState } from "react";
import CheckoutProgress from "~/order/checkout/checkoutProgress";
import StepCustomerAddress from "~/order/checkout/stepCustomerAddress";
import StepShipment from "~/order/checkout/stepShipment";
import StepOverview from "~/order/checkout/stepOverview";
import StepPayment from "~/order/checkout/stepPayment";
import StepSuccess from "~/order/checkout/stepSuccess";
import type { Route } from "./+types/home";
import Button from "~/components/button";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Validation de la commande" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function CheckoutFlow() {
    const [step, setStep] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isStepLoading, setIsStepLoading] = useState(false);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

    const [nextButton, setNextButton] = useState<React.ReactNode>(null);

    useEffect(() => {
        setNextButton(null); // reset à chaque changement de step
    }, [step]);

    return (
        <div className="py-4">
            <CheckoutProgress step={step} />
            <div className="mt-4">
                {step === 0 && <StepCustomerAddress onNext={nextStep} setIsStepLoading={setIsStepLoading}/>}
                {step === 1 && <StepShipment onNext={nextStep} setIsStepLoading={setIsStepLoading} setNextButton={setNextButton}/>}
                {step === 2 && <StepOverview onNext={nextStep} setIsStepLoading={setIsStepLoading}/>}
                {step === 3 && <StepPayment onNext={nextStep} setIsSuccess={setIsSuccess} setIsStepLoading={setIsStepLoading}/>}
                {step === 4 && <StepSuccess isSuccess={isSuccess} setIsStepLoading={setIsStepLoading}/>}
            </div>
            {step > 0 && step < 4 && !isStepLoading && (
                <div className="pt-3 md:pt-6 px-4">

                    <div className="flex flex-col-reverse md:flex-row gap-4 md:justify-between">

                        {/* Précédent */}
                        <Button 
                            text="Précédent"
                            onClick={prevStep}
                            width="w-full md:w-56"
                            customClasses="px-4"
                        />

                        {/* Suivant */}
                        <div className="w-full md:w-56">
                            {nextButton}
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};
