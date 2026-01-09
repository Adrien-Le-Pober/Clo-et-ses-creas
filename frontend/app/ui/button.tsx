interface Button {
    text: string;
    textLoading?: string;
    type?: "submit" | "reset" | "button" | undefined;
    disabled?: boolean;
    width?: string;
    height?: string;
    margin?: string;
    fontSize?: string;
    outlined?: boolean;
    customClasses?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ 
    text,
    textLoading,
    type = "button",
    disabled = false,
    width = 'max-w-80',
    height = 'h-12',
    margin = "m-0",
    fontSize = 'text-xl',
    outlined = false,
    customClasses = "",
    onClick,
}: Button) {
    const buttonClass = `rounded-[10px] ${width} ${height} ${fontSize} ${margin} ${customClasses}
        ${outlined ?
            'border border-primary hover:bg-primary hover:text-secondary'
            : 
            'bg-primary text-secondary'
        }
        ${disabled && 'opacity-70'}`;

    return (
        <button
            className={buttonClass}
            disabled={disabled}
            {...(type !== "submit" ? { onClick } : {})} // onClick seulement si ce n'est pas submit
            type={type}
        >
            {disabled && textLoading ? textLoading : text}
        </button>
    );
}