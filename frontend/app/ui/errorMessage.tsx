interface errorMessageProps {
    message: string;
    className?: string;
}

export default function errorMessage({message, className}: errorMessageProps) {
    const classes = `bg-[#F8D7DA] p-2 mb-2 rounded-md ${className}`

    return (
        <p className={classes}>{message}</p>
    )
}