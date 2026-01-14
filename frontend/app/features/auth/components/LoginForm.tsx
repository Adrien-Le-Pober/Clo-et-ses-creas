import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSession } from "~/core/session/SessionContext";

import type { LoginFormData } from "../types";
import { login } from "../api";

import Button from "~/ui/Button";
import Input from "~/ui/Input";
import ErrorMessage from "~/ui/ErrorMessage";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { isAuthenticated, refreshSession } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (formData: LoginFormData) => {
        setLoading(true);
        setError("");

        try {
            await login(formData.email, formData.password);
            await refreshSession();
            navigate("/", { replace: true });
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Une erreur est survenue.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col border rounded-md shadow w-full sm:w-96 pt-16 px-2 sm:px-14 md:px-16 pb-36 md:pb-44 mb-40"
            noValidate
        >
            <Input
                label="Email"
                name="email"
                register={register("email")}
                errorMsg={errors.email?.message}
            />

            <Input
                label="Mot de passe"
                name="password"
                type="password"
                register={register("password")}
                errorMsg={errors.password?.message}
            />

            <a href="/mot-de-passe-oublie" className="underline pb-7">
                J'ai oublié mon mot de passe
            </a>

            {error && <ErrorMessage message={error} />}

            <Button
                text="Valider"
                textLoading="Chargement..."
                width="w-full"
                disabled={loading}
                type="submit"
            />
        </form>
    );
}
