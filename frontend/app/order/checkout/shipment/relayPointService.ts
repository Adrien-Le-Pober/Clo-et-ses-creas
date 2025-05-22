import axios from "axios";
import type { RelayPoint } from "../interfaces/relayPoint";

interface FetchRelayPointsPayload {
    postcode?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
}

export async function fetchRelayPoints(
    shippingMethodCode: string,
    orderTokenValue: string|null,
    payload: FetchRelayPointsPayload
): Promise<RelayPoint[]> {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URI}shop/shipping-methods/${shippingMethodCode}/orders/${orderTokenValue}/relay-points`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Erreur de récupération des points relais"
        );
    }
}