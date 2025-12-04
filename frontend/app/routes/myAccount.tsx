
import MyAccountPage from "~/my-account/myAccountPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Mon compte" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function MyAccount() {
    return (
        <MyAccountPage/>
    )
}