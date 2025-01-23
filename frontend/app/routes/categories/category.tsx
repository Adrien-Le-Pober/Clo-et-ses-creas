import type { Route } from "../+types/home";
import CategoryItemPage from "~/categories/categoryItemPage";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Catégorie" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function Category() {
    return (
        <CategoryItemPage />
    )
}