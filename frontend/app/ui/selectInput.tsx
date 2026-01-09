import ErrorMessage from "~/ui/errorMessage";

export default function SelectInput({
    label,
    name,
    width = "w-full",
    customClasses = "",
    register,
    errorMsg,
    children
}: {
    label: string;
    name: string;
    width?: string;
    customClasses?: string;
    register: any;
    errorMsg?: string;
    children: React.ReactNode;
}) {
    const selectClass = `border rounded-lg px-2 h-7 pe-8 focus:outline-primary ${width} ${customClasses}`;

    return (
        <div className="flex flex-col pb-7 flex-1">
            <label htmlFor={name} className="pb-3 md:pb-5">{label}</label>

            <select
                name={name}
                className={selectClass}
                {...register}
            >
                {children}
            </select>

            {errorMsg && <ErrorMessage message={errorMsg} />}
        </div>
    );
}
