import { useParams } from "react-router";

export default function CategoryItemPage() {
    const { category } = useParams<{ category: string }>();

    return (
        <><h1>{category}</h1></>
    )
}