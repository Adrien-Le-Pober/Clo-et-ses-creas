import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("creations", "routes/creations.tsx"),
    route("contact", "routes/contact.tsx"),
    route("mon-histoire", "routes/myStory.tsx"),
    route("inscription", "routes/signIn.tsx"),
    route("connexion", "routes/login.tsx"),

    ...prefix("categories", [
        route("/categorie/:category", "routes/categories/category.tsx"),
    ]),
] satisfies RouteConfig;
