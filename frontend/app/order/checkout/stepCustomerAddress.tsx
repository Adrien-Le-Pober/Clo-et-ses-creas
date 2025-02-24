import Button from "~/components/button";
import type { StepProps } from "./interface/stepProps";
import Input from "~/components/input";
import { useForm } from "react-hook-form";
import { customerAddressSchema } from "./formSchema/customerAddressSchema";
import { yupResolver } from "@hookform/resolvers/yup";

interface SignUpFormData {
    firstName: string,
    lastName: string,
    countryCode: string,
    street: string,
    addressAdditional?: string,
    city: string,
    postcode: string,
    phoneNumber: string,
}

export default function StepCustomerAddress({ onNext }: StepProps) {
    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors } 
    } = useForm<SignUpFormData>({
        resolver: yupResolver(customerAddressSchema),
    });

    return (
        <div className="p-4">
            <h2 className="text-center text-4xl mb-12">Mes informations</h2>
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center w-[555px]">
                    <div className="flex w-full justify-between">
                        <Input 
                            label="Prénom"
                            type="text"
                            name="firstName"
                            register={register("firstName")}
                            errorMsg={errors.firstName ? errors.firstName.message : ""}
                            width="w-[255px]"
                        />
                        <Input 
                            label="Nom"
                            type="text"
                            name="lastName"
                            register={register("lastName")}
                            errorMsg={errors.lastName ? errors.lastName.message : ""}
                            width="w-[255px]"
                        />
                    </div>
                    <Input 
                        label="Pays / région"
                        type="text"
                        name="countryCode"
                        register={register("countryCode")}
                        errorMsg={errors.countryCode ? errors.countryCode.message : ""}
                        width="w-[555px]"
                    />
                    <Input 
                        label="Adresse"
                        type="text"
                        name="street"
                        register={register("street")}
                        errorMsg={errors.street ? errors.street.message : ""}
                        width="w-[555px]"
                    />
                    <Input 
                        label="Complément d'adresse (optionnel)"
                        type="text"
                        name="addressAdditional"
                        register={register("addressAdditional")}
                        errorMsg={errors.addressAdditional ? errors.addressAdditional.message : ""}
                        width="w-[555px]"
                    />
                    <div className="flex justify-between w-[555px]">
                        <Input 
                            label="Code postal"
                            type="text"
                            name="postcode"
                            register={register("postcode")}
                            errorMsg={errors.postcode ? errors.postcode.message : ""}
                            customClasses="w-32"
                        />
                        <Input 
                            label="Ville"
                            type="text"
                            name="city"
                            register={register("city")}
                            errorMsg={errors.city ? errors.city.message : ""}
                            customClasses="w-96"
                        />
                    </div>
                    <Input 
                        label="Téléphone"
                        type="text"
                        name="phoneNumber"
                        register={register("phoneNumber")}
                        errorMsg={errors.phoneNumber ? errors.phoneNumber.message : ""}
                        width="w-[555px]"
                    />
                </div>
                <Button text="Suivant" width="w-[350px]" customClasses="my-20 px-4"/>
            </form>
        </div>
    );
};
