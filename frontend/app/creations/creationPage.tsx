import TuneIcon from '@mui/icons-material/Tune';
import SelectButton from '~/components/selectButton';
import { useEffect, useState } from 'react';
import ProductList from '~/products/productList';
import axios from 'axios';

export default function creationPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<string>("");
    const [sortPrice, setSortPrice] = useState<string>("");
    const [taxons, setTaxons] = useState<{children: any; value: string; label: string}[]>([]);
    const [selectedTaxon, setSelectedTaxon] = useState<string[]>([]);

    useEffect(() => {
        const fetchTaxons = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URI}shop/taxons`);
                const taxonData = response.data["hydra:member"].map((taxon: any) => ({
                    value: taxon["@id"],
                    label: taxon.name,
                    children: taxon.children || [],
                }));
                setTaxons(taxonData);
            } catch (err) {
                console.error("Erreur lors de la récupération des taxons:", err);
            }
        };
        fetchTaxons();
    }, []);

    const handleSelectTaxon = (selectedValue: string) => {
        const selectedTaxonObj = taxons.find(taxon => taxon.value === selectedValue);
    
        if (selectedTaxonObj) {
            const allTaxons = [selectedTaxonObj.value, ...selectedTaxonObj.children];
            setSelectedTaxon(allTaxons);
        }
    };

    return (
        <>
            <h1 className="text-center text-3xl md:text-4xl my-16">Créations</h1>
            <div className="px-2 md:px-6 lg:px-16 xl:px-24">
                <section className="flex flex-col sm:flex-row align-center sm:justify-between pb-[52px]">
                    <button 
                        className="flex justify-between items-center order-2 sm:order-1
                                bg-primary text-secondary text-xl rounded-[10px]
                                h-12 w-[152px] px-4"
                        onClick={() => setIsFilterOpen(prev => !prev)}
                    >
                        <span>Filtres</span>
                        <TuneIcon/>
                    </button>
                    <input 
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-[10px] text-xl shadow-lg h-12 order-1 sm:order-2
                                    w-full sm:w-[75%] md:w-[50%] px-3 mb-9 sm:mb-0 sm:ms-3 md:ms-0"
                        placeholder='Rechercher'
                    />
                </section>
                {isFilterOpen && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full place-items-center mb-12">
                        <SelectButton 
                            label="Ordre alphabétique"
                            width="w-full max-w-[304px]"
                            outlined={true}
                            options={[
                                {value:"croissant", "label": "Ordre croissant"},
                                {value:"decroissant", "label": "Ordre décroissant"}
                            ]}
                            onChange={(value) => setSortOrder(value)}
                        />
                        <SelectButton 
                            label="Prix"
                            width="w-full max-w-[304px]"
                            outlined={true}
                            options={[
                                {value:"croissant", "label": "Prix croissant"},
                                {value:"decroissant", "label": "Prix décroissant"}
                            ]}
                            onChange={(value) => setSortPrice(value)}
                        />
                        <SelectButton 
                            label="Couleur"
                            width="w-full max-w-[304px]"
                            outlined={true}
                            options={[]}
                        />
                        <SelectButton 
                            label="Catégorie"
                            width="w-full max-w-[304px]"
                            outlined={true}
                            options={taxons}
                            onChange={(value) => handleSelectTaxon(value)}
                        />
                    </section>
                )}
                <section>
                    <ProductList 
                        endpoint={`${import.meta.env.VITE_API_URI}shop/products`}
                        searchTerm={searchTerm}
                        sortOrder={sortOrder}
                        sortPrice={sortPrice}
                        selectedTaxon={selectedTaxon}
                    />
                </section>
            </div>
        </>
    )
}