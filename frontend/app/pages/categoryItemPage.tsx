import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import ProductList from "~/features/products/components/productList";
import Loader from "~/ui/loader";

export default function CategoryItemPage() {
    const { category } = useParams<{ category: string }>();
    const [taxonCode, setTaxonCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaxonCode = async () => {
            try {
                // Étape 1 : Récupérer toutes les taxons
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URI}shop/taxons`
                );
                const taxons = response.data["hydra:member"];

                // Étape 2 : Filtrer pour trouver le taxon correspondant au slug
                const matchingTaxon = taxons.find((taxon: any) => taxon.slug === `categorie/${category}`);

                if (matchingTaxon) {
                    setTaxonCode(matchingTaxon.code);
                } else {
                    throw new Error("Taxon introuvable.");
                }
                } catch (err) {
                    console.error("Erreur lors de la récupération des taxons :", err);
                    setError("Impossible de charger les produits.");
            } finally {
                setLoading(false);
            }
        };
        fetchTaxonCode();
    }, [category]);

    if (loading) return (
        <div className="py-24">
            <Loader />
        </div>
    );
    if (error) return <p>Erreur : {error}</p>;

    const productEndpoint = `${import.meta.env.VITE_API_URI}shop/products?productTaxons.taxon.code=${taxonCode}&include=variants`

    return (
        <>
            <h1 className="text-center text-3xl lg:text-4xl capitalize py-8 lg:py-24">{category}</h1>
            <section className="flex justify-center pb-24">
                <ProductList endpoint={productEndpoint} />
            </section>
        </>
    )
}