import { useState, type ReactNode } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Accordion({
    title,
    children,
    defaultOpen = false
}: {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="mb-5">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`
                    flex justify-between items-center w-full text-left bg-primary text-secondary h-20 px-5
                    ${open ? "rounded-t-[10px]" : "rounded-[10px]"}
                `}
            >
                <span className="text-lg font-medium">{title}</span>
                <span>{open ? <KeyboardArrowUpIcon fontSize="large"/> : <KeyboardArrowDownIcon fontSize="large"/>}</span>
            </button>

            <div
                className={`
                    overflow-hidden transition-[max-height,opacity] duration-300
                    px-3 pb-5
                    border border-primary
                    ${open ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <div className="pt-4">
                    {children}
                </div>
            </div>
        </div>
    );
}