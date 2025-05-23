interface Button {
    text: string;
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
    type,
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
        <button className={buttonClass} disabled={disabled} onClick={onClick} type={type}>
            {disabled ? "Chargement..." : text}
        </button>
    );
}