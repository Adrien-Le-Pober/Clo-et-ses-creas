import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosClient } from "~/core/api/axios";
import { useSession } from "~/core/session/sessionContext";
import Button from "~/ui/button";

export default function DeleteAccountButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useSession();

    const handleDelete = async () => {
        if (loading) return;

        setLoading(true);
        const toastId = toast.loading("Suppression du compte...");

        try {
            await axiosClient.post(
                "/shop/account/delete",
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Votre compte a bien été supprimé", { id: toastId });

            await logout();
            navigate("/", { replace: true });
        } catch (e) {
            console.error(e);
            toast.error("Impossible de supprimer le compte", { id: toastId });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <button type="button"
                className="mb-10 text-center w-full underline"
                onClick={() => setOpen(true)}
            >
                Supprimer mon compte
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 z-50">
                    <div className="bg-secondary rounded-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="text-xl">
                            Supprimer votre compte ?
                        </h3>

                        <p className="text-sm">
                            Cette action est définitive. Vos données seront
                            anonymisées et vous ne pourrez plus vous connecter.
                        </p>

                        <div className="flex gap-4">
                            <Button
                                text="Annuler"
                                width="w-full"
                                outlined
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            />
                            <Button
                                text={loading ? "Suppression..." : "Supprimer"}
                                width="w-full"
                                onClick={handleDelete}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
