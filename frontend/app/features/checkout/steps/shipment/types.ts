export interface RelayPoint {
    relayPointNumber: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    distance: number;
    openingHours: {
        monday: string | null;
        tuesday: string | null;
        wednesday: string | null;
        thursday: string | null;
        friday: string | null;
        saturday: string | null;
        sunday: string | null;
    };
}

export interface ShippingMethod {
    id: number;
    code: string;
    name: string;
    price: number;
}