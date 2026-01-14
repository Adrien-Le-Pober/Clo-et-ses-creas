import { useSession } from "~/core/session/SessionContext";
import { useLocation, useNavigate } from "react-router";
import { useEffect, type ReactNode } from "react";
import Loader from "~/ui/Loader";

interface Props {
    children: ReactNode;
}

export const RequireSession = ({ children }: Props) => {
    const { isAuthenticated, isSessionLoading } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isSessionLoading && !isAuthenticated) {
            navigate("/connexion", {
                replace: true,
                state: { from: location },
            });
        }
    }, [isSessionLoading, isAuthenticated, navigate, location]);

    if (isSessionLoading) return <Loader />;

    if (!isAuthenticated) return null;

    return <>{children}</>;
};