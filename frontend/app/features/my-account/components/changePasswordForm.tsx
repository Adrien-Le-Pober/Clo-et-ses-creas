import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { axiosClient } from "~/core/api/axios";

import Input from "~/ui/input";
import Button from "~/ui/button";
import { changePasswordSchema } from "../schemas";

interface ChangePasswordFormProps {
    customerId: number | null;
}

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export default function ChangePasswordForm({customerId}: ChangePasswordFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            await axiosClient.put(
                `/shop/customers/${customerId}/password`,
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmNewPassword: data.confirmNewPassword
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            toast.success("Mot de passe mis à jour");
            reset();
        } catch (e: any) {
            toast.error(
                e?.response?.data?.message ??
                "Erreur lors du changement de mot de passe"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Mot de passe actuel"
                type="password"
                name="currentPassword"
                register={register("currentPassword")}
                errorMsg={errors.currentPassword?.message}
            />

            <Input
                label="Nouveau mot de passe"
                type="password"
                name="newPassword"
                register={register("newPassword")}
                errorMsg={errors.newPassword?.message}
            />

            <Input
                label="Confirmation du nouveau mot de passe"
                type="password"
                name="confirmNewPassword"
                register={register("confirmNewPassword")}
                errorMsg={errors.confirmNewPassword?.message}
            />

            <Button
                type="submit"
                text="Changer le mot de passe"
                textLoading="Modification..."
                width="w-full"
                disabled={isSubmitting}
            />
        </form>
    );
}