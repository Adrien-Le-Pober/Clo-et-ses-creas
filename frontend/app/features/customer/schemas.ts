import * as yup from "yup";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export const customerAddressSchema = yup.object({
    firstName: yup
        .string()
        .required("Veuillez saisir votre prénom.")
        .min(2, "Le prénom doit contenir au moins 2 caractères.")
        .max(255, "Le prénom ne peut pas dépasser 255 caractères.")
        .matches(nameRegex, "Le prénom contient des caractères invalides."),
    lastName: yup
        .string()
        .required("Veuillez saisir votre nom.")
        .min(2, "Le nom doit contenir au moins 2 caractères.")
        .max(255, "Le nom ne peut pas dépasser 255 caractères.")
        .matches(nameRegex, "Le nom contient des caractères invalides."),
    email: yup
        .string()
        .required("Veuillez saisir votre email.")
        .email("L'adresse email est invalide.")
        .max(254, "L'adresse email ne peut pas dépasser 254 caractères."),
    countryCode: yup
        .string()
        .required("Veuillez choisir un pays."),
    street: yup
        .string()
        .required("Veuillez saisir votre adresse.")
        .min(2, "Votre adresse doit contenir au moins 2 caractères.")
        .max(255, "Votre adresse ne doit pas dépasser 255 caractères."),
    addressAdditional: yup
        .string(),
    city: yup
        .string()
        .required("Veuillez saisir votre ville.")
        .min(2, "Votre ville doit contenir au moins 2 caractères.")
        .max(255, "Votre ville ne doit pas dépasser 255 caractères."),
    postcode: yup
        .string()
        .required("Veuillez saisir votre code postal.")
        .min(1, "Votre code postal doit contenir au moins 1 caractère.")
        .max(255, "Votre code postal ne doit pas dépasser 255 caractères."),
    phoneNumber: yup
        .string()
        .required("Veuillez saisir votre numéro de téléphone.")
        .max(255, "Votre numéro de téléphone ne peut pas dépasser 255 caractères."),
});