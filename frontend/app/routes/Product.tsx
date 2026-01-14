import ProductPage from "~/pages/ProductPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function Product() {
    return (
        <ProductPage/>
    )
}