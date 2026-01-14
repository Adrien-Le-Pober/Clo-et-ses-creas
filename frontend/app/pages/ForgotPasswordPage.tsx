import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Button from '../ui/Button';
import Input from '../ui/Input';
import ErrorMessage from "~/ui/ErrorMessage";
import SuccessMessage from "~/ui/SuccessMessage";

interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPasswordComponent() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<ForgotPasswordFormData>();

    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const onSubmit = async (forgotPasswordData: ForgotPasswordFormData) => {
        setLoading(true);
        setSuccessMessage("");
        setError("");

        try {
            await axios.post(`${import.meta.env.VITE_API_URI}shop/customers/reset-password`, { email: forgotPasswordData.email });
            setSuccessMessage("Si cette adresse email correspond à un compte existant, vous devriez reçevoir un e-mail de réinitialisation.");
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mx-2 sm:mx-0">
            <h1 className="text-3xl lg:text-4xl py-16">Mot de passe oublié</h1>

            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border rounded-md shadow w-full sm:w-96 pt-16 px-2 sm:px-14 md:px-16 pb-36 md:pb-44 mb-40"
                noValidate
            >
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    register={register("email")} 
                />
                <Button 
                    text="Valider"
                    textLoading="Chargement..."
                    width="w-full"
                    disabled={loading}
                />
                {successMessage && <SuccessMessage message={successMessage} className="mt-3" />}
                {error && <ErrorMessage message={error} className="mt-3" />}
            </form>
        </div>
    );
}