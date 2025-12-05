import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AxiosResponse, AxiosError } from "axios";
import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true
});

export default axiosClient;

interface User {
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: () => Promise<User | null>;
    logout: () => Promise<void>;
    refreshMe: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = user !== null;

    const refreshMe = useCallback(async () => {
        try {
            const res = await axiosClient.get("shop/me");
            setUser(res.data);
            return res.data;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        refreshMe(); // Vérifie si un cookie JWT existe déjà
    }, [refreshMe]);

    const login = useCallback(async () => {
        return await refreshMe();
    }, [refreshMe]);

    const logout = async () => {
        try {
            await axiosClient.post("/logout");
        } catch {}
        setUser(null);
        window.location.href = "/connexion";
    };

    // Intercepteur 401 → déconnexion auto
    useEffect(() => {
        const interceptor = axiosClient.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        // Cleanup → supprime l'intercepteur si le provider est démonté
        return () => {
            axiosClient.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
