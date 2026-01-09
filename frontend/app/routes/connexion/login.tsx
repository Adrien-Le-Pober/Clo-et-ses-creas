import LoginPage from "~/pages/LoginPage";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Connexion" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function Login() {
    return (
        <LoginPage/>
    )
}