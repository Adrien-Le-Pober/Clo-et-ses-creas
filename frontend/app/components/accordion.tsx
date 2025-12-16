import { useState, type ReactNode } from "react";

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
        <div className="border-b border-gray-300 py-4">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center w-full text-left bg-primary text-secondary h-20 px-5 rounded-[10px]"
            >
                <span className="text-lg font-medium">{title}</span>
                <span>{open ? "−" : "+"}</span>
            </button>

            <div
                className={`
                    overflow-hidden transition-[max-height,opacity] duration-300
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