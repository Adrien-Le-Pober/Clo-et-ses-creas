import { useEffect } from "react";
import type { RelayPoint } from "../interfaces/relayPoint";

interface Props {
    relayPoints: RelayPoint[];
    onSelect: (point: RelayPoint) => void;
    selectedPoint: RelayPoint | null;
}

export default function RelayPointList({ relayPoints, onSelect, selectedPoint }: Props) {

    // Load css only on client side to solve hydration error
    useEffect(() => {
        if (typeof window !== "undefined") {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/styles/relayPointList.css"; // fichier situé dans /public/styles/
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, []);

    return (
        <div className="scrollbar w-full xl:w-1/3 max-h-[250px] xl:max-h-[550px] xl:mt-2 overflow-y-auto border-y border-s rounded p-2">
            {relayPoints.map((point) => (
                <div 
                    key={point.relayPointNumber}
                    className={`p-2 cursor-pointer ${selectedPoint?.relayPointNumber === point.relayPointNumber ? "bg-primary text-secondary" : ""}`}
                    onClick={() => onSelect(point)}
                >
                    <h4 className="font-semibold">{point.city} ({point.postcode})</h4>
                    <p className="text-sm">
                        {/* retour à la ligne quand il y a plusieurs espaces
                        pour séparer nom entreprise et adresse */}
                        {point.address.toUpperCase().split(/\s{2,}/).map((line, i) => (
                            <span key={i}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                </div>
            ))}
        </div>
    );
}
