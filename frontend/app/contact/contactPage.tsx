import Button from "~/components/button";
import Input from "~/components/input";

export default function ContactPage() {
    return (
        <>
            <div className="flex flex-col items-center mx-2 sm:mx-0">
                <h1 className="text-3xl lg:text-4xl py-16">Contact</h1>
                <div className="
                    flex flex-col border rounded-md shadow
                    w-full sm:w-96
                    pt-8 px-2 sm:px-14 md:px-16 pb-10
                    mb-40
                ">
                    <Input name="firstname" label="Prénom"/>
                    <Input name="lastname" label="Nom"/>
                    <Input name="email" label="Email"/>
                    <Input name="phone" label="Téléphone (facultatif)"/>
                    <div className="flex flex-col pb-7">
                        <label htmlFor="message" className="pb-3 md:pb-5">Message</label>
                        <textarea name="message" className="border rounded-lg px-2"></textarea>
                        <span className="pt-2.5">Messages d'erreurs</span>
                    </div>
                    <Button text="Valider" width="w-full"/>
                </div>
            </div>
        </>
    )
}