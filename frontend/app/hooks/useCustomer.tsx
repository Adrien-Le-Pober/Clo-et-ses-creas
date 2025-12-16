import { useEffect, useState } from "react";
import axiosClient from "~/auth/authContext";

export function useCustomer(customerId: number | null) {
    const [customer, setCustomer] = useState<any>(null);
    const [address, setAddress] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!customerId) return;

        const fetchCustomer = async () => {
            setLoading(true);
            try {
                // Récupérer le customer
                const { data } = await axiosClient.get(`/shop/customers/${customerId}`);
                setCustomer(data);

                // Récupérer l'adresse par défaut si elle existe
                if (data.defaultAddress) {
                    const addressRes = await axiosClient.get(
                        data.defaultAddress.replace("/api/v2", "")
                    );
                    setAddress(addressRes.data);
                }

            } catch (e) {
                console.error("Erreur fetch customer:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    return { customer, address, loading };
}