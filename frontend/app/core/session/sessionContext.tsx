import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Identity } from "./types";
import { axiosClient } from "../api/axios";

interface SessionContextType { 
    identity: Identity | null;
    isSessionLoading: boolean;
    isAuthenticated: boolean;
    refreshSession: () => Promise<Identity | null>;
    logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        setIsSessionLoading(true);
        try {
            const { data } = await axiosClient.get("/shop/me");

            const identity: Identity = {
                id: data.customerId.toString(),
                email: data.email,
                provider: "password",
            };

            setIdentity(identity);
            return identity;
        } catch {
            setIdentity(null);
            return null;
        } finally {
            setIsSessionLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSession(); // Vérifie si un cookie JWT existe déjà
    }, [refreshSession]);

    const logout = async () => {
        try {
            await axiosClient.post("/logout");
        }  finally {
            setIdentity(null);
        }
    };

    return (
        <SessionContext.Provider value={{ identity, isAuthenticated: !!identity, isSessionLoading, logout, refreshSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used inside SessionProvider");
    return ctx;
};
