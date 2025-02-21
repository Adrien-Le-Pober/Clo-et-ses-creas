import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("creations", "routes/creations.tsx"),
    route("contact", "routes/contact.tsx"),
    route("mon-histoire", "routes/myStory.tsx"),
    route("inscription", "routes/signIn.tsx"),

    route("produit/:slug", "routes/productDetails.tsx"),

    route("panier", "routes/cart.tsx"),

    route("validation-commande", "routes/checkoutFlow.tsx"),

    ...prefix("connexion", [
        route("/", "routes/connexion/login.tsx"),
        route("mot-de-passe-oublie", "routes/connexion/forgotPassword.tsx"),
        route("nouveau-mot-de-passe", "routes/connexion/resetPassword.tsx"),
    ]),

    ...prefix("categories", [
        route("/categorie/:category", "routes/categories/category.tsx"),
    ]),
] satisfies RouteConfig;
