import Accordion from "~/components/accordion";
import AccountPersonalInfoForm from "~/components/accountPersonalInfoForm";
import ChangePasswordForm from "./changePasswordForm";
import { useAuth } from "~/auth/authContext";
import { useCustomer } from "~/hooks/useCustomer";
import DeleteAccountButton from "./deleteAccountButton";

export default function MyAccountPage() {
    const { user } = useAuth();
    const { customer, address, loading } = useCustomer(user?.customerId ?? null);

    if (!user) return null;

    return (
        <div className="flex flex-col items-center px-4">

            <h1 className="pb-10 pt-20 md:pt-32 text-4xl">
                Mon compte
            </h1>

            <div className="w-full max-w-xl"> 
                <Accordion title="Informations personnelles" defaultOpen>
                    <AccountPersonalInfoForm
                        user={user}
                        customer={customer}
                        address={address}
                        customerId={user.customerId}
                        loading={loading}
                    />
                </Accordion>

                <Accordion title="Modifier mon mot de passe">
                    <ChangePasswordForm customerId={user.customerId} />
                </Accordion>

                <DeleteAccountButton />
            </div>
        </div>
    );
}