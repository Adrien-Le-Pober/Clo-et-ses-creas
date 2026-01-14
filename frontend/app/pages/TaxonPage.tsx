import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import ProductList from "~/features/product/components/ProductList";
import Loader from "~/ui/Loader";

export default function TaxonPage() {
    const { slug } = useParams<{ slug: string }>();
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
                const matchingTaxon = taxons.find((taxon: any) => taxon.slug === `categorie/${slug}`);

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
    }, [slug]);

    if (loading) return (
        <div className="py-24">
            <Loader />
        </div>
    );
    if (error) return <p>Erreur : {error}</p>;

    const productEndpoint = `${import.meta.env.VITE_API_URI}shop/products?productTaxons.taxon.code=${taxonCode}&include=variants`

    return (
        <>
            <h1 className="text-center text-3xl lg:text-4xl capitalize py-8 lg:py-24">{slug}</h1>
            <section className="flex justify-center pb-24">
                <ProductList endpoint={productEndpoint} />
            </section>
        </>
    )
}