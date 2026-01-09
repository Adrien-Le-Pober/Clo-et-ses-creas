import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import Input from "~/ui/input";
import Button from "~/ui/button";
import SelectInput from "../../../ui/selectInput";
import Loader from "~/ui/loader";
import { axiosClient } from "~/core/api/axios";
import { useEffect, useState } from "react";

import { customerAddressSchema } from "~/features/customer/schemas";

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
  user: any | null;
  customer: any | null;
  address: any | null;
  customerId: number | null;
  loading?: boolean;
  onSubmitSuccess?: (data: PersonalInfoFormData) => void;
}

export default function AccountPersonalInfoForm({ user, customer, customerId, address, loading, onSubmitSuccess }: AccountPersonalInfoFormProps) {
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
    setIsSubmitting(true);
    const toastId = toast.loading("Enregistrement en cours...");

    try {
      /**
       * CAS 1 — Guest
       * On ne touche PAS à l’API shop/addresses
       * Le checkout se chargera de l’adresse
       */
      if (!user || !customer) {
        toast.success("Informations enregistrées", { id: toastId });
        onSubmitSuccess?.(data);
        return;
      }

      let addressId: string | undefined = address?.["@id"];

      /**
       * CAS 2 — Utilisateur connecté
       * Adresse existante → update
       * Sinon → création
       */
      if (addressId) {
        await axiosClient.put(
          addressId.replace("/api/v2", ""),
          {
            firstName: data.firstName,
            lastName: data.lastName,
            countryCode: data.countryCode,
            street: data.street,
            addressAdditional: data.addressAdditional,
            city: data.city,
            postcode: data.postcode,
            phoneNumber: data.phoneNumber,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        const res = await axiosClient.post(
          "/shop/addresses",
          {
            firstName: data.firstName,
            lastName: data.lastName,
            countryCode: data.countryCode,
            street: data.street,
            addressAdditional: data.addressAdditional,
            city: data.city,
            postcode: data.postcode,
            phoneNumber: data.phoneNumber,
            customer: `/api/v2/shop/customers/${customerId}`,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        addressId = res.data["@id"];
      }

      /**
       * Mise à jour du customer
       */
      await axiosClient.put(
        `/shop/customers/${customerId}`,
        {
          defaultAddress: addressId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          birthday: customer.birthday ?? null,
          gender: customer.gender ?? "u",
          phoneNumber: data.phoneNumber,
          subscribedToNewsletter: customer.subscribedToNewsletter ?? false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Informations mises à jour !", { id: toastId });
      onSubmitSuccess?.(data);

    } catch (error) {
      console.error("Erreur update:", error);
      toast.error("Une erreur est survenue", { id: toastId });
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
