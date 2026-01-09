import CartPage from "~/pages/cartPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Panier" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function Cart() {
    return (
        <CartPage/>
    )
}