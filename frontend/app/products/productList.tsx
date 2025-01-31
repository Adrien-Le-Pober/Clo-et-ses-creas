import ProductItem from "./productItem";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "~/components/loader";
import Button from "~/components/button";

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    taxon: string;
}

interface ProductListProps {
    endpoint: string,
    searchTerm?: string;
    sortOrder?: string;
    sortPrice?: string;
    selectedTaxons?: string[];
}

export default function ProductList({
    endpoint,
    searchTerm,
    sortOrder,
    sortPrice,
    selectedTaxons
}: ProductListProps) {
    const apiURI = `${import.meta.env.VITE_API_URI}`;

    const [productList, setProductList] = useState<Product[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(9);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productResponse = await axios.get(`${endpoint}`);
                const products = productResponse.data["hydra:member"];
                const productIds = products.map((product: any) => product.id);

                const params = new URLSearchParams();
                productIds.forEach((id: string) => params.append("product[]", id));

                const fetchAllVariants = async () => {
                    let allVariants: any[] = [];
                    let nextPage = `${apiURI}shop/product-variants?${params.toString()}`;

                    while (nextPage) {
                        const response = await axios.get(nextPage);
                        allVariants = [...allVariants, ...response.data["hydra:member"]];

                        const nextUrl = response.data["hydra:view"]?.["hydra:next"] || "";

                        if (nextUrl) {
                            const cleanedNextUrl = nextUrl.replace(/^\/?api\/v2\//, "");
                            nextPage = `${import.meta.env.VITE_API_URI}${cleanedNextUrl}`;
                        } else {
                            nextPage = "";
                        }
                    }

                    return allVariants;
                };

                const variants = await fetchAllVariants();

                const mergedData: Product[] = variants.map((variant: any) => {
                    const product = products.find((prod: any) => prod['@id'] === variant.product);
                    return {
                        id: variant?.id,
                        name: product?.name || "",
                        description: product?.description || "",
                        images: product?.images?.map((img: any) => img.path) || [],
                        price: variant.price / 100,
                        taxon: product?.mainTaxon,
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

    let filteredProductList = productList;

    // 🔍 Filtrer les produits en fonction de searchTerm
    if (searchTerm) {
        filteredProductList = productList.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 📌 Filtrage par taxon sélectionné
    if (selectedTaxons && selectedTaxons.length > 0) {
        filteredProductList = filteredProductList.filter((product) =>
            selectedTaxons.includes(product.taxon)
        );
    }

    // 🔄 Appliquer le tri par prix
    if (sortPrice === "prix_croissant") {
        filteredProductList.sort((a, b) => a.price - b.price);
    } else if (sortPrice === "prix_decroissant") {
        filteredProductList.sort((a, b) => b.price - a.price);
    }

    // 🔄 Appliquer le tri alphabétique
    if (sortOrder && sortOrder === "croissant") {
        filteredProductList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder && sortOrder === "decroissant") {
        filteredProductList.sort((a, b) => b.name.localeCompare(a.name));
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center mb-[72px]">
                {filteredProductList.slice(0, visibleCount).map((product, index) => (
                    <ProductItem key={product.id || index} {...product} />
                ))}
            </div>
            {visibleCount < filteredProductList.length && (
                <Button 
                    text="Afficher plus"
                    outlined={true}
                    onClick={() => setVisibleCount(prev => prev + 9)}
                    width="w-full max-w-[350px]"
                    margin="mb-[72px]"
                />
            )}
        </div>
    );
}