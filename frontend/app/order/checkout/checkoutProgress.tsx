import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const steps: string[] = ["Mes infos", "Livraison", "Récapitulatif", "Paiement", "Succès"];

interface CheckoutProgressProps {
    step: number;
}

export default function CheckoutProgress({ step }: CheckoutProgressProps) {
    const progressSteps = ["w-[0%]", "w-[25%]", "w-[48%]", "w-[70%] md:w-[72%]", "w-[92%] sm:w-[94%] lg:w-[97%]"];
    const progressWidth = progressSteps[step];
    const icons = [
        <PersonIcon/>,
        <LocalShippingIcon/>,
        <SearchIcon/>,
        <CreditCardIcon/>,
        <TaskAltIcon/>
    ];

    return (
        <div className="relative w-full flex items-center justify-between py-4">
            {/* Barre de progression arrière-plan */}
            <div className="absolute left-5 right-5 top-1/2 h-1.5 bg-[#bbb]"></div>

            {/* Barre de progression remplie */}
            <div
                className={`absolute top-1/2 h-1.5 bg-primary transition-all duration-300 left-5 ${progressWidth}`}
            ></div>

            {/* Étapes */}
            {steps.map((label, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* Cercle actif */}
                    {step === index && (
                        <RadioButtonUncheckedIcon className="absolute top-[38px] bg-secondary"/>
                    )}
                    <div className={`w-8 h-8 pb-5 flex items-center justify-center transition-all
                        ${step === index ? 'opacity-100' : 'opacity-50'}`}>
                        {icons[index]}
                    </div>
                    <span className="mt-2">{step === index && label}</span>
                </div>
            ))}
        </div>
    );
};