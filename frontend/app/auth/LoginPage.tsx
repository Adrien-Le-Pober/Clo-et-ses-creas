import Button from "~/components/button";
import Input from "~/components/input";

export default function LoginPage() {
    return (
        <>
            <div className="flex flex-col items-center mx-2 sm:mx-0">
                <h1 className="text-3xl lg:text-4xl py-16">Connexion</h1>
                <div className="
                    flex flex-col border rounded-md shadow
                    w-full sm:w-96
                    pt-16 px-2 sm:px-14 md:px-16 pb-36 md:pb-44
                    mb-40
                ">
                    <Input name="email" label="Email"/>
                    <Input name="password" label="Mot de passe"/>
                    <Button text="Valider" width="w-full"/>
                </div>
            </div>
        </>
    )
}