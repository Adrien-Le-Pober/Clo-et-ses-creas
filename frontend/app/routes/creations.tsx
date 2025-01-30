import CreationPage from "~/creations/creationPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Créations" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function Creations() {
    return (
        <CreationPage/>
    )
}