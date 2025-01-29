import ProductItem from "./productItem";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "~/components/loader";

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
}

interface ProductListProps {
    endpoint: string,
}

export default function ProductList({endpoint}: ProductListProps) {
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productResponse = await axios.get(`${endpoint}`);
                const products = productResponse.data["hydra:member"];

                const productIds = products.map((product: any) => product.id);
                const params = new URLSearchParams();
                productIds.forEach((id: string) => params.append("product[]", id));

                const variantResponse = await axios.get(
                    `${import.meta.env.VITE_API_URI}shop/product-variants?${params.toString()}`
                );

                const variants = variantResponse.data["hydra:member"];

                const mergedData: Product[] = variants.map((variant: any) => {
                    const product = products.find((prod: any) => prod['@id'] === variant.product);
                    return {
                        id: variant?.id,
                        name: product?.name || "",
                        description: product?.description || "",
                        images: product?.images?.map((img: any) => img.path) || [],
                        price: variant.price / 100,
                    };
                });

                setProductList(mergedData);
            } catch (err) {
                console.error(err);
                setError("Echec du chargement des produits.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <Loader/>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {productList.map((product, index) => (
                <ProductItem key={product.id || index} {...product} />
            ))}
        </div>
    );
}