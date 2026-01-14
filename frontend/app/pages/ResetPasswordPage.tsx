import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Button from '../ui/Button';
import Input from '../ui/Input';
import ErrorMessage from "~/ui/ErrorMessage";
import SuccessMessage from "~/ui/SuccessMessage";

interface ResetPasswordFormData {
    newPassword: string;
    confirmNewPassword: string;
}

const validationSchema = yup.object().shape({
    newPassword: yup
        .string()
        .required("Veuillez saisir un mot de passe.")
        .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
    confirmNewPassword: yup
        .string()
        .required("Veuillez confirmer votre mot de passe.")
        .oneOf([yup.ref("newPassword"), ""], "Les mots de passe ne correspondent pas."),
})

export default function ResetPasswordComponent() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        watch 
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(validationSchema),
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Token invalide ou manquant.");
        }
    }, [token]);

    const onSubmit = async (resetPasswordData: ResetPasswordFormData) => {
        if (!token) {
            setError("Token manquant.");
            return;
        }

        setLoading(true);
        setSuccessMessage("");
        setError("");

        const headers = {
            'Content-Type': 'application/merge-patch+json',
        };

        try {
            await axios.patch(`${import.meta.env.VITE_API_URI}shop/customers/reset-password/${token}`, { 
                newPassword: resetPasswordData.newPassword,
                confirmNewPassword: resetPasswordData.confirmNewPassword
            }, {
                headers
            });

            setSuccessMessage("Votre mot de passe a été réinitialisé avec succès !");
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mx-2 sm:mx-0">
            <h1 className="text-3xl lg:text-4xl py-16">Réinitialisation du mot de passe</h1>

            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col border rounded-md shadow w-full sm:w-96 pt-16 px-2 sm:px-14 md:px-16 pb-36 md:pb-44 mb-40"
                noValidate
            >
                <Input
                    type="password"
                    name="password"
                    label="Nouveau mot de passe"
                    register={register("newPassword")}
                />
                {errors.newPassword && <ErrorMessage message={errors.newPassword.message || "Une erreur est survenue"}/>}

                <Input
                    type="password"
                    name="confirmPassword"
                    label="Confirmez le mot de passe"
                    register={register("confirmNewPassword")} 
                />
                {errors.confirmNewPassword &&  <ErrorMessage message={errors.confirmNewPassword.message || "Une erreur est survenue"} />}

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
