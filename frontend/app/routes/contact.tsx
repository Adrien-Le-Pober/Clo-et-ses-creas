import ContactPage from "~/contact/contactPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Les créas de Clo - contact" },
        { name: "description", content: "Bienvenue sur Les créas de Clo" },
    ];
}

export default function Contact() {
    return (
        <ContactPage/>
    )
}