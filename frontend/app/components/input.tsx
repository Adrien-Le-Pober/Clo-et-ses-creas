import type { UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./errorMessage";

interface InputProps {
    label: string;
    name: string;
    type?: string;
    width?: string;
    customClasses?: string;
    errorMsg?: string;
    register?: UseFormRegisterReturn;
}

export default function Input({
    label,
    name,
    type = 'text',
    width = "w-full",
    customClasses,
    errorMsg,
    register,
}: InputProps) {
    const inputClass=`border rounded-lg px-2 ${width} ${customClasses}`

    return (
        <>
            <div className="flex flex-col pb-7">
                <label htmlFor={name} className="pb-3 md:pb-5">{label}</label>
                <input
                    type={type}
                    name={name}
                    className={inputClass}
                    {...register}
                />

                {errorMsg && (
                    <ErrorMessage message={errorMsg}/>
                )}
            </div>
        </>
    );
}