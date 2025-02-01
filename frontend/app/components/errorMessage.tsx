interface errorMessageProps {
    message: string;
}

export default function errorMessage({message}: errorMessageProps) {
    return (
        <p className="bg-[#F8D7DA] p-2 mb-2 rounded-md">{message}</p>
    )
}