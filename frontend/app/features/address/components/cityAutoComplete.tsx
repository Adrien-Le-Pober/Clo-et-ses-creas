import { useEffect, useRef, useState } from "react";
import type { CityQuery } from "~/features/address/types";

interface Props {
    onSelect: (cityQuery: CityQuery) => void;
}

export default function CityAutoComplete({onSelect}: Props) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<CityQuery[]>([]);
    const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Load css only on client side to solve hydration error
    useEffect(() => {
        if (typeof window !== "undefined") {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/styles/cityAutoComplete.css"; // fichier situé dans /public/styles/
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, []);

    useEffect(() => {
        if (!inputValue.trim() || isSuggestionSelected) return;

        const delayDebounce = setTimeout(() => {
            if (inputValue.length < 2) return setSuggestions([]);
            setIsLoading(true);

            const fetchCities = async () => {
                try {
                    const baseUrl = "https://secure.geonames.org/postalCodeSearchJSON";

                    const params = new URLSearchParams({
                        placename: inputValue,
                        username: "Zenithao",
                        country: "FR"
                    });

                    const response = await fetch(`${baseUrl}?${params.toString()}`);
                    const data = await response.json();

                    if (data.postalCodes) {
                        const filtered = data.postalCodes
                            .slice(0, 20);

                        const cities = filtered.map((item: any) => ({
                            name: item.name || item.placeName,
                            postalcode: item.postalCode,
                            countryCode: item.countryCode
                        }));

                        setSuggestions(cities);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des villes :", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCities();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    // Fermer suggestions si clic en dehors
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value.trim() === "") {
            setSuggestions([]);
        }
        setIsSuggestionSelected(false);
    };

    const handleSuggestionClick = (suggestion: CityQuery) => {
        setInputValue(`${suggestion.postalcode} ${suggestion.name}`);
        setSuggestions([]);
        setIsSuggestionSelected(true);
        onSelect(suggestion);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <label htmlFor="placename" className="hidden">Nom de la ville</label>
            <input 
                type="text"
                name="placename"
                className="h-10 my-2 border rounded-lg px-3 focus:outline-primary w-full"
                placeholder="Choisir une ville"
                value={inputValue}
                onChange={handleInputChange}
            />

            {suggestions.length > 0 && (
                <ul className={"scrollbar absolute z-50 mt-1 bg-secondary border rounded-lg shadow max-h-48 overflow-y-auto w-full"}>
                {suggestions.map((city, idx) => (
                    <li
                        key={`${city.name}-${idx}`}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm hover:bg-primary hover:text-secondary"
                        onClick={() => handleSuggestionClick(city)}
                    >
                        {city.postalcode ? `${city.postalcode} - ` : ""}
                        {city.name}
                    </li>
                ))}
                </ul>
            )}

            {isLoading && (
                <p className="absolute top-full left-0 text-xs text-gray-500 mt-1">Chargement...</p>
            )}
        </div>
    );
}