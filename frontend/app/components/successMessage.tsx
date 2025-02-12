interface successMessageProps {
    message: string;
    className?: string;
}

export default function successMessage({message, className}: successMessageProps) {
    const classes = `bg-[#E8F3ED] p-2 mb-2 rounded-md ${className}`

    return (
        <p className={classes}>{message}</p>
    )
}