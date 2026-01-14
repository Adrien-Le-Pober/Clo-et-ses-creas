import TuneIcon from '@mui/icons-material/Tune';
import SelectButton from '~/ui/SelectButton';
import { useEffect, useState } from 'react';
import ProductList from '~/features/product/components/ProductList';
import axios from 'axios';
import FilterChips from '~/ui/FilterChips';

export default function creationPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortPrice, setSortPrice] = useState<string>("");
    const [taxonList, setTaxonList] = useState<{children: any; value: string; label: string}[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(""); // l'option en cours de sélection
    const [selectedTaxons, setSelectedTaxon] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchTaxons = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URI}shop/taxons`);
                const taxonData = response.data["hydra:member"].map((taxon: any) => ({
                    value: taxon["@id"],
                    label: taxon.name,
                    children: taxon.children || [],
                }));
                setTaxonList(taxonData);
            } catch (err) {
                console.error("Erreur lors de la récupération des taxons:", err);
            }
        };
        fetchTaxons();
    }, []);

    const handleSelectTaxon = (selectedValue: string) => {
        const selectedTaxonObj = taxonList.find(taxon => taxon.value === selectedValue);
    
        if (selectedTaxonObj) {
            setSelectedTaxon((prev) => {
                const newTaxons = [selectedTaxonObj.value, ...selectedTaxonObj.children];
                return [...new Set([...prev, ...newTaxons])];  // Évite les doublons
            });
        }
    };

    const handleAddFilter = (type: "price" | "taxon", value: string, label: string) => {
        let updatedFilters = activeFilters.filter((filter) => filter.value !== value);

        if (type === "price") {
            updatedFilters = updatedFilters.filter((filter) => !["prix_croissant", "prix_decroissant"].includes(filter.value));
            setSortPrice(value);
        } else if (type === "taxon") {
            if (!selectedTaxons.includes(value)) {
                setSelectedTaxon(prev => {
                    return [...prev, value]
                });
            }
        }

        updatedFilters.push({ label, value });
        setActiveFilters(updatedFilters);
    };

    const handleRemoveFilter = (value: string) => {
        let updatedFilters = activeFilters.filter((filter) => filter.value !== value);

        if (value === sortPrice) {
            setSortPrice("");
        } else {
            setSelectedTaxon(prev => {
                const taxonToRemove = taxonList.find(t => t.value === value);
                if (taxonToRemove) {
                    const childrenToRemove = taxonToRemove.children;
                    return prev.filter(t => ![taxonToRemove.value, ...childrenToRemove].includes(t));
                }
                return prev;
            });
        }

        setActiveFilters(updatedFilters);
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
                        type="button"
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

                {activeFilters.length > 0 && <FilterChips activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} />}

                {isFilterOpen && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full place-items-center mb-12">
                        <SelectButton 
                            label="Prix"
                            width="w-full max-w-[304px]"
                            outlined={true}
                            options={[
                                {value:"prix_croissant", "label": "Prix croissant"},
                                {value:"prix_decroissant", "label": "Prix décroissant"}
                            ]}
                            onChange={(value) => handleAddFilter("price", value, value === "prix_croissant" ? "Prix croissant" : "Prix décroissant")}
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
                            options={taxonList}
                            value={selectedCategory}
                            onChange={(value) => {
                                const taxon = taxonList.find((t) => t.value === value);
                                if (taxon) {
                                    handleAddFilter("taxon", value, taxon.label);
                                    handleSelectTaxon(value);
                                    setSelectedCategory("");
                                }
                            }}
                        />
                    </section>
                )}
                <section>
                    <ProductList 
                        endpoint={`${import.meta.env.VITE_API_URI}shop/products`}
                        searchTerm={searchTerm}
                        sortPrice={sortPrice}
                        selectedTaxons={selectedTaxons}
                    />
                </section>
            </div>
        </>
    )
}