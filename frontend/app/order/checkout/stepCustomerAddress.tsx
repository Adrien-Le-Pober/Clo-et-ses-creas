import AccountPersonalInfoForm from "~/components/accountPersonalInfoForm";
import type { StepProps } from "./interfaces/stepProps";

export default function StepCustomerAddress({ onNext }: StepProps) {
    return (
        <div className="p-4">
            <h2 className="text-center text-4xl mb-12">Mes informations</h2>
            <div className="flex flex-col items-center w-full">
                <div className="w-[300px] sm:w-[555px]">
                    <AccountPersonalInfoForm onSubmitSuccess={onNext}/>
                </div>
            </div>
        </div>
    );
}