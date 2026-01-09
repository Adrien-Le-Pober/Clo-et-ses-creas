import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { useSession } from "~/core/session/sessionContext";

import Button from "~/ui/button";
import Input from "~/ui/input";
import { signUpSchema } from "~/features/auth/schemas";
import ErrorMessage from "~/ui/errorMessage";

interface SignUpFormData {
    email: string;
    password: string;
    firstName: string,
    lastName: string,
    rgpd?: boolean,
}

export default function SignInPage() {
    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors } 
    } = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { refreshSession } = useSession();
    const navigate = useNavigate();

    const onSubmit = async (signUpForData: SignUpFormData) => {
        setLoading(true);
        setError("");

        const toastId = toast.loading("Inscription en cours...");

        try {
            // 1Création du compte
            await axios.post(
                `${import.meta.env.VITE_API_URI}shop/customers`,
                signUpForData
            );

            // Connexion automatique juste après inscription
            await axios.post(
                `${import.meta.env.VITE_API_URI}shop/customers/token`,
                {
                    email: signUpForData.email,
                    password: signUpForData.password,
                },
                { withCredentials: true }
            );

            toast.success("Inscription réussie !", { id: toastId });

            await refreshSession();

            navigate("/", { replace: true });
        } catch (err: any) {
            if (err.response) {
                const { data, status } = err.response;

                if (status === 422 && data?.violations) {
                    const emailError = data.violations.find(
                        (violation: any) => violation.propertyPath === "email"
                    );
    
                    if (emailError) {
                        setError(emailError.message);
                        return;
                    }
                }
            }
            setError("Une erreur est survenue lors de l'inscription.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="flex flex-col items-center">
                <h1 className="text-3xl lg:text-4xl py-16">Inscription</h1>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="flex flex-col border rounded-md shadow mb-40 max-w-lg mx-2 pt-16 px-3 md:px-16 pb-36 md:pb-44">
                        <Input 
                            label="Prénom"
                            name="firstName"
                            register={register("firstName")}
                            errorMsg={errors.firstName ? errors.firstName.message : ""}
                        />
                        <Input 
                            label="Nom"
                            name="lastName"
                            register={register("lastName")}
                            errorMsg={errors.lastName ? errors.lastName.message : ""}
                        />
                        <Input 
                            label="Email"
                            name="email"
                            register={register("email")}
                            errorMsg={errors.email ? errors.email.message : ""} 
                        />
                        <Input
                            type="password"
                            label="Mot de passe"
                            name="password"
                            register={register("password")}
                            errorMsg={errors.password ? errors.password.message : ""} 
                        />

                        <div className="flex items-center pb-11">
                            <input 
                                type="checkbox"
                                {...register("rgpd")}
                                name="rgpd"
                                className="w-5 h-5"
                            />
                            <label htmlFor="rgpd" className="ps-3">
                                J'accepte la&nbsp;
                                <a href="" className="underline">Politique de confidentialité</a>
                            </label>
                        </div>
                        {errors.rgpd?.message && (
                            <ErrorMessage message={errors.rgpd.message}/>
                        )}

                        {error && <ErrorMessage message={error}/>}

                        <Button
                            text="Valider"
                            textLoading="Chargement..."
                            disabled={loading}
                        />
                    </div>
                </form>
            </section>
        </>
    )
}