import Accordion from "~/components/accordion";
import AccountPersonalInfoForm from "~/components/accountPersonalInfoForm";

export default function MyAccountPage() {
    return (
        <div className="flex flex-col items-center px-4">

            <h1 className="pb-10 pt-20 md:pt-32 text-4xl">
                Mon compte
            </h1>

            <div className="w-full max-w-xl"> 
                <Accordion title="Informations personnelles" defaultOpen>
                    <AccountPersonalInfoForm />
                </Accordion>

                <Accordion title="Modifier mon mot de passe">
                    "{/* Formulaire à venir */}"
                </Accordion>

                "{/* Bouton + modal confirmation */}"
            </div>
        </div>
    );
}