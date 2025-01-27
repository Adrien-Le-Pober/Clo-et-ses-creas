interface Input {
    label: string;
    name: string;
    width?: string;
    errorMsg?: string;
}

export default function Input({
    label,
    name,
    width = "max-w-80",
    errorMsg = "Une erreur est survenue",
}: Input) {
    const inputClass=`border rounded-lg px-2 ${width}`

    return (
        <>
            <div className="flex flex-col pb-7">
                <label htmlFor={name} className="pb-3 md:pb-5">{label}</label>
                <input
                    type="text"
                    name={name}
                    className={inputClass}
                />
                <span className="pt-2.5">{errorMsg}</span>
            </div>
        </>
    );
}