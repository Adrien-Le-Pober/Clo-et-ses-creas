import axios from "axios";
import type { ShippingMethod } from "../interfaces/shippingMethod";

export async function fetchShippingMethods(): Promise<ShippingMethod[]> {
    try {
        const shippingMethods = await axios.get(`${import.meta.env.VITE_API_URI}shop/shipping-methods`);
        return shippingMethods.data["hydra:member"];
    } catch (error) {
        console.error("Erreur lors de la récupération des méthodes de livraison :", error);
        throw new Error("Impossible de charger les méthodes de livraison.");
    }
}

export async function fetchShippingMethodPrice(
    shippingMethodCode: string, orderTokenValue: string|null
): Promise<number> {
    try {
        const price = await axios.get(`${import.meta.env.VITE_API_URI}shop/shipping-methods/${shippingMethodCode}/${orderTokenValue}/shipping-price`);
        return price.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des méthodes de livraison :", error);
        throw new Error("Impossible de charger les méthodes de livraison.");
    }
}