import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "~/auth/authContext";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Button from "~/components/button";
import Input from "~/components/input";
import ErrorMessage from "~/components/errorMessage";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<LoginFormData>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    const onSubmit = async (loginData: LoginFormData) => {
        setLoading(true);
        setError("");

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URI}shop/customers/token`,
                {
                    email: loginData.email,
                    password: loginData.password
                },
                {
                    withCredentials: true
                }
            );

            await login();
        } catch (err: any) {
            if (err.response) {
                const { status, data } = err.response;

                if (status === 401) {
                    setError("Email ou mot de passe incorrect.");
                } else {
                    setError(data.message || "Une erreur est survenue.");
                }
            } else {
                setError("Impossible de se connecter.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mx-2 sm:mx-0">
            <h1 className="text-3xl lg:text-4xl py-16">Connexion</h1>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="flex flex-col border rounded-md shadow w-full sm:w-96 pt-16 px-2 sm:px-14 md:px-16 pb-36 md:pb-44 mb-40"
                noValidate
            >
                <Input 
                    name="email" 
                    label="Email" 
                    register={register("email")} 
                />
                <Input 
                    name="password" 
                    label="Mot de passe" 
                    type="password" 
                    register={register("password")} 
                />

                <Link to="mot-de-passe-oublie" className="underline pb-7">J'ai oublié mon mot de passe</Link>

                {error && <ErrorMessage message={error} />}

                <Button
                    text="Valider"
                    textLoading="Chargement..."
                    width="w-full"
                    disabled={loading}
                />
            </form>
        </div>
    );
}
