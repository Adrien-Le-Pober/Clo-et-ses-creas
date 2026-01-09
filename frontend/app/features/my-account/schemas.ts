import * as yup from "yup";

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required("Mot de passe actuel requis"),
    newPassword: yup
        .string()
        .min(8, "8 caractères minimum")
        .required("Nouveau mot de passe requis"),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
        .required("Confirmation requise"),
});