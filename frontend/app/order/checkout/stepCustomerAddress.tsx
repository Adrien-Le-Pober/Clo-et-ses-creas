import Button from "~/components/button";
import type { StepProps } from "./interfaces/stepProps";
import Input from "~/components/input";
import { useForm } from "react-hook-form";
import { customerAddressSchema } from "./formSchema/customerAddressSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "~/auth/authContext";
import { useCart } from "../cart/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorMessage from "~/components/errorMessage";
import Loader from "~/components/loader";

interface AddressFormData {
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    street: string,
    addressAdditional?: string,
    city: string,
    postcode: string,
    phoneNumber: string,
}

export default function StepCustomerAddress({ onNext }: StepProps) {
    const { isAuthenticated } = useAuth();
    const { updateCart } = useCart();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<AddressFormData>({
        resolver: yupResolver(customerAddressSchema),
    });

    useEffect(() => {
        const fetchCountries = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URI}shop/countries`);
                const countryList = data["hydra:member"].map((country: any) => ({
                    code: country.code,
                    name: country.name,
                }));
                setCountries(countryList);
            } catch (error) {
                console.error("Erreur lors du chargement des pays", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const onSubmit = async (data: AddressFormData) => {
        setIsSubmit(true);
        await updateCart({ 
            email: data.email,
            billingAddress: {
                firstName: data.firstName,
                lastName: data.lastName,
                countryCode: data.countryCode,
                street: data.street,
                addressAdditional: data.addressAdditional,
                city: data.city,
                postcode: data.postcode,
                phoneNumber: data.phoneNumber,
            },
            shippingAddress : {
                firstName: data.firstName,
                lastName: data.lastName,
                countryCode: data.countryCode,
                street: data.street,
                addressAdditional: data.addressAdditional,
                city: data.city,
                postcode: data.postcode,
                phoneNumber: data.phoneNumber,
            }
        });
        setIsSubmit(false);
        if (onNext) onNext();
    };

    if (isLoading) return <Loader/>;

    return (
        <div className="p-4">
            <h2 className="text-center text-4xl mb-12">Mes informations</h2>
            <form onSubmit={handleSubmit(onSubmit) } className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center w-[300px] sm:w-[555px]">
                    <div className="flex w-full justify-between">
                        <Input 
                            label="Prénom"
                            type="text"
                            name="firstName"
                            register={register("firstName")}
                            errorMsg={errors.firstName ? errors.firstName.message : ""}
                            width="w-[140px] sm:w-[255px]"
                        />
                        <Input 
                            label="Nom"
                            type="text"
                            name="lastName"
                            register={register("lastName")}
                            errorMsg={errors.lastName ? errors.lastName.message : ""}
                            width="w-[140px] sm:w-[255px]"
                        />
                    </div>
                    {!isAuthenticated && (
                        <Input 
                            label="Email"
                            type="email"
                            name="email"
                            register={register("email")}
                            errorMsg={errors.email ? errors.email.message : ""}
                            width="w-[300px] sm:w-[555px]"
                        />
                    )}
                    <div className="flex flex-col pb-7 w-[300px] sm:w-[555px]">
                        <label className="pb-3 md:pb-5">Pays / région</label>
                        <select
                            {...register("countryCode")}
                            className="border rounded-lg px-2 h-7"
                        >
                            <option value="">Sélectionnez un pays</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.countryCode && <ErrorMessage message={errors.countryCode.message || ""}/>}
                    </div>
                    <Input 
                        label="Adresse"
                        type="text"
                        name="street"
                        register={register("street")}
                        errorMsg={errors.street ? errors.street.message : ""}
                        width="w-[300px] sm:w-[555px]"
                    />
                    <Input 
                        label="Complément d'adresse (optionnel)"
                        type="text"
                        name="addressAdditional"
                        register={register("addressAdditional")}
                        errorMsg={errors.addressAdditional ? errors.addressAdditional.message : ""}
                        width="w-[300px] sm:w-[555px]"
                    />
                    <div className="flex w-full justify-between sm:w-[555px]">
                        <Input 
                            label="Code postal"
                            type="text"
                            name="postcode"
                            register={register("postcode")}
                            errorMsg={errors.postcode ? errors.postcode.message : ""}
                            customClasses="w-[75px] sm:w-[100px]"
                        />
                        <Input 
                            label="Ville"
                            type="text"
                            name="city"
                            register={register("city")}
                            errorMsg={errors.city ? errors.city.message : ""}
                            customClasses="w-[200px] sm:w-[300px]"
                        />
                    </div>
                    <Input 
                        label="Téléphone"
                        type="text"
                        name="phoneNumber"
                        register={register("phoneNumber")}
                        errorMsg={errors.phoneNumber ? errors.phoneNumber.message : ""}
                        width="w-[300px] sm:w-[555px]"
                    />
                </div>
                <Button text="Suivant" width="sm:w-[350px]" customClasses="my-10 sm:my-20 px-4" disabled={isSubmit}/>
            </form>
        </div>
    );
};
