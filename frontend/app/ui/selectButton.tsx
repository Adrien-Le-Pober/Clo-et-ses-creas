import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect, useRef, useState } from 'react';

interface SelectButtonProps {
    label: string;
    options: { value: string; label: string }[];
    value?: string;
    width?: string; 
    height?: string; 
    fontSize?: string;
    customWrapperClasses?: string;
    customButtonClasses?: string;
    customOptionClasses?: string;
    outlined?: boolean;
    onChange?: (value: string) => void;
}

export default function SelectButton({
    label,
    options,
    width = 'max-w-80',
    height = 'h-12',
    fontSize = 'text-xl',
    customWrapperClasses,
    customButtonClasses,
    customOptionClasses,
    outlined = false,
    onChange,
}: SelectButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(label);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const boxClass = `relative inline ${width} ${customWrapperClasses}`;

    const buttonClass = `rounded-[10px] ${width} ${height} ${fontSize} ${customButtonClasses} px-4 flex items-center justify-between cursor-pointer
        ${outlined ?
            'bg-secondary border border-primary'
            : 
            'bg-primary text-secondary'
        }`;

    const optionWrapperClass = `absolute top-full left-0 border w-full bg-white shadow-lg z-10 mt-1 rounded-[10px] overflow-hidden`;

    const optionClass = `cursor-pointer px-4 py-2 bg-white hover:bg-primary hover:text-white transition ${customOptionClasses}`;

    // Ferme le menu si clic en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={boxClass} ref={wrapperRef}>
            <div className={buttonClass} onClick={() => setIsOpen(!isOpen)}>
                {selectedLabel}
                <KeyboardArrowDownIcon className="text-primary h-[24px] w-[24px]" />
            </div>

            {isOpen && (
                <ul className={optionWrapperClass}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onChange?.(option.value);
                                setSelectedLabel(option.label);
                                setIsOpen(false);
                            }}
                            className={optionClass}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}