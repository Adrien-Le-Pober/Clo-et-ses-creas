
import MyAccountPage from "~/pages/myAccountPage";
import type { Route } from "./+types/home";
import { RequireSession } from "./guards/RequireSession";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Mon compte" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function MyAccount() {
    return (
        <RequireSession>
            <MyAccountPage />
        </RequireSession>
    )
}