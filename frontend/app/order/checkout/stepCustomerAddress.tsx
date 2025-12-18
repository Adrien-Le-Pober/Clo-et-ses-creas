import AccountPersonalInfoForm from "~/components/accountPersonalInfoForm";
import type { StepProps } from "./interfaces/stepProps";
import { useAuth } from "~/auth/authContext";
import { useCustomer } from "~/hooks/useCustomer";
import { useCart } from "../cart/CartContext";

export default function StepCustomerAddress({ onNext }: StepProps) {
    const { user } = useAuth();
    const { customer, address, loading } = useCustomer(user?.customerId ?? null);
    const { updateCart } = useCart();

    const handleSubmit = async (data: any) => {
        try {
        const orderPayload: any = {
            email: data.email,
            billingAddress: {
            firstName: data.firstName,
            lastName: data.lastName,
            street: data.street,
            addressAdditional: data.addressAdditional,
            city: data.city,
            postcode: data.postcode,
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
            },
        };

        // Utilisateur connecté → on lie le customer
        if (user?.customerId) {
            orderPayload.customer = `/api/v2/shop/customers/${user.customerId}`;
        }

        await updateCart(orderPayload);

        onNext?.();
        } catch (error) {
        console.error("Erreur update order:", error);
        alert("Impossible d'enregistrer vos informations.");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="p-4">
            <h2 className="text-center text-4xl mb-12">Mes informations</h2>
            <div className="flex flex-col items-center w-full">
                <div className="w-[300px] sm:w-[555px]">
                    <AccountPersonalInfoForm
                        user={customer ?? null}
                        customer={customer ?? null}
                        address={address ?? null}
                        customerId={user?.customerId ?? null}
                        loading={loading}
                        onSubmitSuccess={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}