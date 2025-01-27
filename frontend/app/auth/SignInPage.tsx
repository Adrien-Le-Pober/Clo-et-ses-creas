import Button from "~/components/button";
import Input from "~/components/input";

export default function SignInPage() {
    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-3xl lg:text-4xl py-16">Inscription</h1>
                <div className="flex flex-col border rounded-md shadow mb-40 max-w-lg pt-16 px-14 md:px-16 pb-36 md:pb-44">
                    <Input name="email" label="Email"/>
                    <Input name="password" label="Mot de passe"/>
                    <a href="" className="underline">J'ai oublié mon mot de passe</a>
                    <br/>
                    <div className="flex items-center pb-11">
                        <input type="checkbox" name="rgpd" className="w-5 h-5"/>
                        <label htmlFor="rgpd" className="ps-3">
                            J'accepte la&nbsp;
                            <a href="" className="underline">Politique de confidentialité</a>
                        </label>
                    </div>
                    <Button text="Valider"/>
                </div>
            </div>
        </>
    )
}