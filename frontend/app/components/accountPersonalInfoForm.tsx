import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "~/auth/authContext";
import { useCustomer } from "~/hooks/useCustomer";

import Input from "~/components/input";
import Button from "~/components/button";
import Loader from "~/components/loader";
import axiosClient from "~/auth/authContext";
import { useEffect, useState } from "react";

import { customerAddressSchema } from "~/schemas/customerAddressSchema";
import SelectInput from "./selectInput";

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  street: string;
  addressAdditional?: string;
  city: string;
  postcode: string;
  phoneNumber: string;
}

interface AccountPersonalInfoFormProps {
  onSubmitSuccess?: () => void;
}

export default function AccountPersonalInfoForm({ onSubmitSuccess }: AccountPersonalInfoFormProps) {
  const { user } = useAuth();
  const { customer, address, loading } = useCustomer(user?.customerId ?? null);

  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<PersonalInfoFormData>({
      resolver: yupResolver(customerAddressSchema),
    });

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axiosClient.get("shop/countries");
        setCountries(data["hydra:member"].map((c: any) => ({ code: c.code, name: c.name })));
      } catch (e) {
        console.error("Erreur fetch countries", e);
      }
    };
    fetchCountries();
  }, []);

  // Préremplir les champs avec customer + address
  useEffect(() => {
    if (!customer) return;

    setValue("firstName", customer.firstName || "");
    setValue("lastName", customer.lastName || "");
    setValue("email", customer.email || "");

    if (address) {
      setValue("countryCode", address.countryCode || "");
      setValue("street", address.street || "");
      setValue("addressAdditional", address.addressAdditional || "");
      setValue("city", address.city || "");
      setValue("postcode", address.postcode || "");
      setValue("phoneNumber", address.phoneNumber || "");
    }
  }, [customer, address, setValue]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!customer) return;

    setIsSubmitting(true);

    try {
      let addressId = address?.["@id"];

      // Si l'adresse existe, on l'a met à jour, sinon on la crée
      if (addressId) {
        const addressPayload = {
          firstName: data.firstName,
          lastName: data.lastName,
          countryCode: data.countryCode,
          street: data.street,
          addressAdditional: data.addressAdditional,
          city: data.city,
          postcode: data.postcode,
          phoneNumber: data.phoneNumber,
        };

        await axiosClient.put(addressId, addressPayload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        const addressPayload = {
          firstName: data.firstName,
          lastName: data.lastName,
          countryCode: data.countryCode,
          street: data.street,
          addressAdditional: data.addressAdditional,
          city: data.city,
          postcode: data.postcode,
          phoneNumber: data.phoneNumber,
          customer: `/api/v2/shop/customers/${user?.customerId}`,
        };

        const res = await axiosClient.post("/shop/addresses", addressPayload, {
          headers: { "Content-Type": "application/json" },
        });

        addressId = res.data["@id"];
      }

      // Mise à jour du customer avec l'adresse par défaut
      const customerPayload = {
        defaultAddress: addressId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: customer.birthday ?? null,
        gender: customer.gender ?? "u",
        phoneNumber: data.phoneNumber,
        subscribedToNewsletter: customer.subscribedToNewsletter ?? false,
      };

      await axiosClient.put(`/shop/customers/${user?.customerId}`, customerPayload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Informations mises à jour !");
      onSubmitSuccess?.();

    } catch (e) {
      console.error("Erreur update:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-4 w-full">
        <Input label="Prénom" name="firstName" register={register("firstName")} errorMsg={errors.firstName?.message} />
        <Input label="Nom" name="lastName" register={register("lastName")} errorMsg={errors.lastName?.message} />
      </div>

      <Input label="Email" name="email" type="email" register={register("email")} errorMsg={errors.email?.message} />

      <SelectInput label="Pays / région" name="countryCode" register={register("countryCode")} errorMsg={errors.countryCode?.message}>
        <option value="">Sélectionnez un pays</option>
        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
      </SelectInput>

      <Input label="Adresse" name="street" register={register("street")} errorMsg={errors.street?.message} />
      <Input label="Complément d'adresse (optionnel)" name="addressAdditional" register={register("addressAdditional")} />
      <div className="flex gap-4 w-full">
        <Input label="Code postal" name="postcode" register={register("postcode")} errorMsg={errors.postcode?.message} />
        <Input label="Ville" name="city" register={register("city")} errorMsg={errors.city?.message} />
      </div>
      <Input label="Téléphone" name="phoneNumber" register={register("phoneNumber")} errorMsg={errors.phoneNumber?.message} />

      <Button type="submit" text="Enregistrer" textLoading="Enregistrement..." width="w-full" disabled={isSubmitting} />
    </form>
  );
}
