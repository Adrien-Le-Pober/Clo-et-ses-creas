import ForgotPasswordPage from "~/auth/ForgotPasswordPage";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Mot de passe oublié" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function ForgotPassword() {
    return (
        <ForgotPasswordPage/>
    )
}