import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SelectButtonProps {
    label: string;
    options: { value: string; label: string }[];
    value?: string;
    width?: string; 
    height?: string; 
    fontSize?: string;
    outlined?: boolean;
    onChange?: (value: string) => void;
}

export default function SelectButton({
    label,
    options,
    width = 'max-w-80',
    height = 'h-12',
    fontSize = 'text-xl',
    outlined = false,
    onChange,
}: SelectButtonProps) {
    const buttonClass = `rounded-[10px] ${width} ${height} ${fontSize} appearance-none text-xl text-center
        ${outlined ?
            'bg-secondary border border-primary'
            : 
            'bg-primary text-secondary'
        }`;

    const boxClass = `relative inline ${width}`

    return (
        <div className={boxClass}>
            {/* Faux bouton qui affiche toujours le label */}
            <div className={buttonClass + " flex items-center justify-between px-4 cursor-pointer"}>
                {label}
                <KeyboardArrowDownIcon className="text-primary h-[24px] w-[24px]" />
            </div>

            {/* Sélecteur caché qui gère la valeur */}
            <select
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                    onChange?.(e.target.value);
                    e.target.value = "";
                }}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}