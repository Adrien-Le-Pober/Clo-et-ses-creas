import Accordion from "~/ui/accordion";
import AccountPersonalInfoForm from "~/features/customer/components/accountPersonalInfoForm";
import ChangePasswordForm from "~/features/my-account/components/changePasswordForm";
import { useSession } from "~/core/session/sessionContext";
import { useCustomer } from "~/hooks/useCustomer";
import DeleteAccountButton from "../../features/my-account/components/deleteAccountButton";
import ErrorMessage from "~/ui/errorMessage";

export default function ProfilePage() {
    const { identity } = useSession();

    const customerId = identity?.id ? Number(identity.id) : null;
    const { customer, address, isCustomerLoading, customerError } = useCustomer(customerId);

    if (customerError) {
        return <ErrorMessage message={customerError.message} />;
    }

    return (
        <div className="flex flex-col items-center px-4">

            <h1 className="pb-10 pt-20 md:pt-32 text-4xl">
                Mon compte
            </h1>

            <div className="w-full max-w-xl"> 
                <Accordion title="Informations personnelles" defaultOpen>
                    <AccountPersonalInfoForm
                        user={identity}
                        customer={customer}
                        address={address}
                        customerId={customerId}
                        loading={isCustomerLoading}
                    />
                </Accordion>

                <Accordion title="Modifier mon mot de passe">
                    <ChangePasswordForm customerId={customerId} />
                </Accordion>

                <DeleteAccountButton />
            </div>
        </div>
    );
}