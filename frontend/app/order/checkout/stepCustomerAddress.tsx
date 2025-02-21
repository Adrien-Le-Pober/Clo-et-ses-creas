import Button from "~/components/button";
import type { StepProps } from "./interface/stepProps";

export default function StepCustomerAddress({ onNext }: StepProps) {
    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Mes informations</h2>
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
                <Button text="Suivant" customClasses="py-2 px-4"/>
            </form>
        </div>
    );
};
