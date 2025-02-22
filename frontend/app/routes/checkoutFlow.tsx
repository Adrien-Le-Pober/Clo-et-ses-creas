import { useState } from "react";
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

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

    return (
        <div className="py-4">
            <CheckoutProgress step={step} />
            <div className="mt-4">
                {step === 0 && <StepCustomerAddress onNext={nextStep} />}
                {step === 1 && <StepShipment onNext={nextStep} />}
                {step === 2 && <StepOverview onNext={nextStep} />}
                {step === 3 && <StepPayment onNext={nextStep} />}
                {step === 4 && <StepSuccess />}
            </div>
            {step > 0 && <Button text="Précédent" onClick={prevStep} customClasses="mt-4 px-3"/>}
        </div>
    );
};
