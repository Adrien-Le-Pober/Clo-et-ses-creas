interface Button {
    text: string;
    width?: string; 
    height?: string; 
    fontSize?: string; 
    outlined?: boolean; 
}

export default function Button({ 
    text,
    width = 'max-w-80',
    height = 'h-12',
    fontSize = 'text-xl',
    outlined = false
}: Button) {
    const buttonClass = `rounded-[10px] ${width} ${height} ${fontSize} 
        ${outlined ?
            'border border-primary hover:bg-primary hover:text-secondary'
            : 
            'bg-primary text-secondary'
        }`;

    return (
        <button className={buttonClass}>
            {text}
        </button>
    );
}