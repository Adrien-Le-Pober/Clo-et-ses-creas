import type { RelayPoint } from "../interfaces/relayPoint";
import { useEffect, useRef, useState } from "react";

interface Props {
    relayPoints: RelayPoint[];
    selectedPoint: RelayPoint | null;
}

export default function MondialRelayMap({ relayPoints, selectedPoint }: Props) {
    const [LeafletMap, setLeafletMap] = useState<any>(null);
    const [redIcon, setRedIcon] = useState<any>(null);
    const markerRefs = useRef<Record<string, any>>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Load leaflet css only on client side to solve hydration error
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);

            import("leaflet").then((L) => {
                const icon = new L.Icon({
                    iconUrl:
                        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                    shadowUrl:
                        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                });
                setRedIcon(icon);
            });

            import("react-leaflet").then((module) => {
                setLeafletMap(() => module);
            });
        }
    }, []);
    
    if (!LeafletMap || !redIcon) {
        return <p>Chargement de la carte...</p>;
    }
    
    const { MapContainer, TileLayer, Marker, Popup, useMap } = LeafletMap;

    const MapUpdater = () => {
        const map = useMap();

        useEffect(() => {
            if (!selectedPoint) return;

            const { latitude, longitude, relayPointNumber } = selectedPoint;

            const marker = markerRefs.current[relayPointNumber];
            if (marker) {
                map.panTo([latitude, longitude]); // recentre le marker
                setTimeout(() => { // on laisse le temps à la map de se déplacer
                    marker.openPopup();
                }, 300);
            }
        }, [selectedPoint]);

        return null;
    };
    
    return (
        <MapContainer 
            center={[relayPoints[0].latitude, relayPoints[0].longitude]}
            zoom={15}
            className="h-[400px] md:h-[500px] w-full shadow z-10"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            {relayPoints.map((point) => (
                <Marker 
                    key={point.relayPointNumber}
                    position={[point.latitude, point.longitude]}
                    icon={redIcon}
                    ref={(ref: any) => {
                        if (ref) markerRefs.current[point.relayPointNumber] = ref;
                    }}
                >
                    <Popup>
                        {point.address.toUpperCase().split(/\s{2,}/).map((line, i) => (
                            <span key={i} className="text-primary">
                                <strong>{line}</strong>
                                <br />
                            </span>
                        ))}
                        <br />
                        <strong className="text-primary">Horaires :</strong>
                        <ul className="pt-2 ps-5 flex flex-col gap-2 text-primary">
                            <li><strong>Lundi</strong> : {point.openingHours.monday || 'Fermé'}</li>
                            <li><strong>Mardi</strong> : {point.openingHours.tuesday || 'Fermé'}</li>
                            <li><strong>Mercredi</strong> : {point.openingHours.wednesday || 'Fermé'}</li>
                            <li><strong>Jeudi</strong> : {point.openingHours.thursday || 'Fermé'}</li>
                            <li><strong>Vendredi</strong> : {point.openingHours.friday || 'Fermé'}</li>
                            <li><strong>Samedi</strong> : {point.openingHours.saturday || 'Fermé'}</li>
                            <li><strong>Dimanche</strong> : {point.openingHours.sunday || 'Fermé'}</li>
                        </ul>
                    </Popup>
                </Marker>
            ))}

            {/* Injection de logique pour déplacer la vue si selectedPoint change */}
            <MapUpdater />
        </MapContainer>
    );
};