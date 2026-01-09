import { useEffect, useState } from "react";
import { axiosClient } from "~/core/api/axios";
import type { Address } from "~/types/Address";
import type { Customer } from "~/types/Customer";

type CustomerErrorType =
    | "unauthorized"
    | "not_found"
    | "network"
    | "unknown";

interface CustomerError {
    type: CustomerErrorType;
    message: string;
}

export function useCustomer(customerId: number | null) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [isCustomerLoading, setIsCustomerLoading] = useState(false);
    const [customerError, setCustomerError] = useState<CustomerError | null>(null);

    useEffect(() => {
        if (!customerId) {
            setCustomer(null);
            setAddress(null);
            setCustomerError(null);
            return;
        }

        const fetchCustomer = async () => {
            setIsCustomerLoading(true);
            setCustomerError(null);

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

            } catch (e: any) {
                let error: CustomerError = {
                    type: "unknown",
                    message: "Erreur lors du chargement du customer",
                };

                if (e.response?.status === 401) {
                    error = { type: "unauthorized", message: "Session expirée" };
                } else if (e.response?.status === 404) {
                    error = { type: "not_found", message: "Customer introuvable" };
                } else if (e.message === "Network Error") {
                    error = { type: "network", message: "Erreur réseau" };
                }

                console.error("Erreur fetch customer:", error);
                setCustomerError(error);
                setCustomer(null);
                setAddress(null);
            } finally {
                setIsCustomerLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    return { customer, address, isCustomerLoading, customerError, };
}