import Button from "~/components/button";
import type { StepProps } from "./interfaces/stepProps";

export default function StepOverview({ onNext }: StepProps) {
    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Récapitulatif</h2>
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
                <Button text="Suivant" customClasses="py-2 px-4"/>
            </form>
        </div>
    );
};
