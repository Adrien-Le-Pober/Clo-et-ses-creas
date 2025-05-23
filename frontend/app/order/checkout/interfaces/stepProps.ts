export interface StepProps {
    onNext?: () => void;
    onPrev?: () => void;
    setIsSuccess?: (value: boolean) => void;
    isSuccess?: boolean;
}