import { useEffect, useState } from "react";
import { useCart } from "../../../cart/CartContext";

import type { StepProps } from "../../types";
import type { RelayPoint } from "./types";
import type { CityQuery } from "~/ui/city/types";

import Button from "~/ui/Button";
import Loader from "~/ui/Loader";
import CityAutoComplete from "~/ui/city/CityAutoComplete";

import RelayPointList from "./components/RelayPointList";
import MondialRelayMap from "./components/MondialRelayMap";
import ShippingMethodList from "./components/ShippingMethodList";

import { fetchRelayPoints } from "./services/relayPoint.service";

import MyLocationIcon from '@mui/icons-material/MyLocation';
import axios from "axios";


export default function StepShipment({ onNext, setIsStepLoading, setNextButton}: StepProps) {
    const { state, updateCart, getCart } = useCart();
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("mondial_relay");
    const [relayPointList, setRelayPointList] = useState<RelayPoint[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<RelayPoint | null>(null);
    const [shipmentAddress, setShipmentAddress] = useState<object|undefined>(undefined);
    const [cityQuery, setCityQuery] = useState<CityQuery | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedShippingMethod || !state.cartToken) return;
        const fetchRelayPointList = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const relayPointListData = await fetchRelayPoints(selectedShippingMethod, state.cartToken, {'postcode': cityQuery?.postalcode});
                setRelayPointList(relayPointListData);
            } catch (err) {
                setError("Impossible de charger les points relais.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRelayPointList();
    }, [selectedShippingMethod, state.cartToken, cityQuery]);

    // stocke le dernier point relais dans le localStorage
    useEffect(() => {
        if (selectedPoint) {
            localStorage.setItem("lastRelayPoint", JSON.stringify(selectedPoint));
        }
    }, [selectedPoint]);

    // récupère le dernier point relais dans le localStorage
    useEffect(() => {
        const saved = localStorage.getItem("lastRelayPoint");
        if (saved) {
            const parsed = JSON.parse(saved);
            setSelectedPoint(parsed);
        }
    }, []);

    useEffect(() => {
        setIsStepLoading?.(isLoading);
    }, [isLoading]);

    useEffect(() => {
        setNextButton?.(
            <Button
                onClick={handleSubmit}
                text="Suivant"
                width="w-full md:max-w-56"
                customClasses="py-2 px-4"
                disabled={isSubmitting}
            />
        );
    }, [isSubmitting, selectedPoint, selectedShippingMethod]);

    const handleLocateUser = () => {
        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const relayPointListData = await fetchRelayPoints(
                        selectedShippingMethod,
                        state.cartToken,
                        { "latitude": latitude, 'longitude': longitude }
                    );
                    setRelayPointList(relayPointListData);
                } catch (err) {
                    setError("Erreur lors de la récupération des points relais.");
                } finally {
                    setIsLoading(false);
                }
            },
            () => {
                setError("Impossible d'obtenir votre position.");
                setIsLoading(false);
            }
        );
    };

    const handleSubmit = async () => {
        if (!selectedPoint) {
            setError("Veuillez sélectionner un point relais.");
            return;
        }

        setIsSubmitting(true);

        const apiURI = import.meta.env.VITE_API_URI;
        
        const [company, ...streetParts] = selectedPoint.address.split(/\s{2,}/);
        const street = streetParts.join(' ').trim();

        setShipmentAddress({
            "street": street,
            "company": company,
            "city": selectedPoint.city,
            "postcode": selectedPoint.postcode,
            "countryCode": selectedPoint.country,
            // contourner la validation de Sylius en mettant des valeurs factices
            "firstName": "Point",
            "lastName": "Relais"
        });

        try {
            
            await updateCart({ shippingAddress: shipmentAddress });

            // ajout de la méthode de livraison dans order
            const order = await getCart();
            const shipment = order.shipments[0];
            await axios.patch(`${apiURI}shop/orders/${state.cartToken}/shipments/${shipment['id']}`, 
                {shippingMethod: `${apiURI}shop/shipping-methods/${selectedShippingMethod}`}, 
                {headers: {'Content-Type': 'application/merge-patch+json'}}
            );

            setIsSubmitting(false);
            if (onNext) onNext();
        } catch (err) {
            setError("Impossible de mettre à jour l'adresse de livraison.");
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Loader/>;

    return (
        <div className="my-12">
            {error && <p className="text-center text-xl">{error}</p>}
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="md:w-2/3 w-full flex flex-col xl:flex-row xl:gap-4 order-2 md:order-1">
                    <RelayPointList relayPoints={relayPointList} onSelect={setSelectedPoint} selectedPoint={selectedPoint} />
                    <div className="h-[450px] md:h-[500px] w-full">
                        <div className="flex items-center justify-between gap-2">
                            <div 
                                onClick={handleLocateUser}
                                className="flex items-center justify-center p-1 border rounded-lg cursor-pointer h-10 w-10"
                            >
                                <MyLocationIcon/>
                            </div>
                            <CityAutoComplete onSelect={setCityQuery}/>
                        </div>
                        
                        <MondialRelayMap
                            relayPoints={relayPointList}
                            selectedPoint={selectedPoint}
                            onSelect={setSelectedPoint}
                        />
                    </div>
                    
                </div>
                <div className="xl:flex xl:flex-col xl:justify-between md:w-1/3 w-full order-1 px-3 md:order-2 xl:h-[550px]">
                    <ShippingMethodList onSelect={setSelectedShippingMethod} />
                </div>
            </div>
        </div>
    );
};