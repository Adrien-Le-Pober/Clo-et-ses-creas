import { useEffect, useState } from "react";
import Taxon from "./Taxon";
import axios from 'axios';
import Loader from "~/ui/Loader";

interface Taxon {
    id: string;
    code: string;
    name: string;
    slug: string;
    images: string[];
}

export default function TaxonList() {
    const [taxonList, setTaxonList] = useState<Taxon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaxonList = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URI}shop/taxons`);
                const data = response.data;

                // Transformation des données pour correspondre au type Taxonomy
                const taxonomies: Taxon[] = data["hydra:member"].map((taxon: any) => ({
                    id: taxon.id,
                    code: taxon.code,
                    name: taxon.name,
                    slug: taxon.slug,
                    images: taxon.images?.map((img: any) => img.path) || [],
                }));

                setTaxonList(taxonomies);
            } catch (err) {
                console.error(err);
                setError('Echec du chargement des catégories');
            } finally {
                setLoading(false);
            }
        };

        fetchTaxonList();
    }, []);

    if (loading) return <Loader/>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {taxonList.map((taxon) => (
                <Taxon key={taxon.id} {...taxon} />
            ))}
        </div>
    )
}