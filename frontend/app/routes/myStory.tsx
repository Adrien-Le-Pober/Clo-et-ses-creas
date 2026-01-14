import MyStoryPage from "~/pages/MyStoryPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - Mon histoire" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function MyStory() {
    return (
        <MyStoryPage/>
    )
}