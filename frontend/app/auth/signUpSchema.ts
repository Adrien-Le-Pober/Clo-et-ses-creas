import * as yup from "yup";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export const signUpSchema = yup.object({
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
    password: yup
        .string()
        .required("Veuillez saisir un mot de passe.")
        .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
    rgpd: yup
    .boolean()
    .oneOf([true], "Vous devez accepter la politique de confidentialité."),
});