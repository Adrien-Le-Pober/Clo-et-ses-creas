import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("mon-histoire", "routes/myStory.tsx"),

    ...prefix("categories", [
        route("/categorie/:category", "routes/categories/category.tsx"),
    ]),
] satisfies RouteConfig;
