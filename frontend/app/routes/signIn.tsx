import SignInPage from "~/auth/SignInPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Inscription" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function SignIn() {
    return (
        <SignInPage/>
    )
}