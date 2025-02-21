const steps: string[] = ["Mes infos", "Livraison", "Récapitulatif", "Paiement", "Succès"];

interface CheckoutProgressProps {
    step: number;
}

export default function CheckoutProgress({ step }: CheckoutProgressProps) {
    return (
        <div className="w-full flex items-center justify-between py-4">
            {steps.map((label, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div
                        className={`w-8 h-8 flex items-center justify-center
                        ${index <= step ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}
                        `}
                    >
                        {index + 1}
                    </div>
                    <span className="text-xs mt-2">{label}</span>
                </div>
            ))}
        </div>
    );
};