import { useEffect, useState } from "react";
import TaxonomyItem from "./taxonomyItem";
import axios from 'axios';
import Loader from "~/ui/loader";

interface Taxonomy {
    id: string;
    code: string;
    name: string;
    slug: string;
    images: string[];
}

export default function taxonomyList() {
    const [taxonomyList, setTaxonomyList] = useState<Taxonomy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaxonomies = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URI}shop/taxons`);
                const data = response.data;

                // Transformation des données pour correspondre au type Taxonomy
                const taxonomies: Taxonomy[] = data["hydra:member"].map((taxon: any) => ({
                    id: taxon.id,
                    code: taxon.code,
                    name: taxon.name,
                    slug: taxon.slug,
                    images: taxon.images?.map((img: any) => img.path) || [],
                }));

                setTaxonomyList(taxonomies);
            } catch (err) {
                console.error(err);
                setError('Echec du chargement des catégories');
            } finally {
                setLoading(false);
            }
        };

        fetchTaxonomies();
    }, []);

    if (loading) return <Loader/>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {taxonomyList.map((taxonomy) => (
                <TaxonomyItem key={taxonomy.id} {...taxonomy} />
            ))}
        </div>
    )
}