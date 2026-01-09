export interface StepProps {
    onNext?: () => void;
    onPrev?: () => void;
    setIsSuccess?: (value: boolean) => void;
    isSuccess?: boolean;
    setIsStepLoading?: (value: boolean) => void;
    setNextButton?: (node: React.ReactNode) => void;
}