import * as yup from "yup";

export const contactSchema = yup.object({
    name: yup.string().required("Votre nom est requis"),
    email: yup.string().email("Email invalide").required("Votre email est requis"),
    message: yup
        .string()
        .required("Un message est requis")
        .min(10, "Votre message est trop court"),
    phone: yup.string().notRequired(),
    website: yup.string().nullable(), // honeypot
});