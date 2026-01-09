import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "~/ui/button";
import Input from "~/ui/input";

import { contactSchema } from "~/features/contact/schemas";

export default function ContactPage() {
    const apiURI = import.meta.env.VITE_API_URI;

    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});;
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(contactSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: any) => {
        setServerErrors({});
        setSuccessMessage("");

        try {
            const res = await axios.post(apiURI + "contact", data);

            if (res.data.success) {
                setSuccessMessage("Votre message a bien été envoyé !");
                reset();
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setServerErrors(err.response.data.errors);
            }
        }
    };

    return (
        <>
            <div className="flex flex-col items-center mx-2 sm:mx-0">
                <h1 className="text-3xl lg:text-4xl py-16">Contact</h1>

                {successMessage && (
                    <p className="bg-green-100 text-green-700 p-3 rounded mb-6 text-center">
                        {successMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="w-96">

                    {/* Honeypot invisible */}
                    <input type="text" {...register("website")} style={{ display: "none" }} />

                    <Input
                        label="Nom"
                        name="name"
                        register={register("name")}
                        errorMsg={errors.name?.message || serverErrors.name}
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        register={register("email")}
                        errorMsg={errors.email?.message || serverErrors.email}
                    />

                    <Input
                        label="Téléphone (optionnel)"
                        name="phone"
                        type="tel"
                        register={register("phone")}
                        errorMsg={errors.phone?.message || serverErrors.phone}
                    />

                    <Input
                        label="Message"
                        name="message"
                        customClasses="h-32"
                        register={register("message")}
                        errorMsg={errors.message?.message || serverErrors.message}
                        textarea={true}
                    />

                    <div className="my-4 flex justify-center">
                        <Button
                            text="Envoyer"
                            textLoading="Envoi en cours..."
                            type="submit"
                            disabled={isSubmitting}
                            width="w-full"
                        />
                    </div>
                </form>
            </div>
        </>
    )
}