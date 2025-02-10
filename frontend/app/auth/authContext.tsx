import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_API_URI}shop/orders`, { withCredentials: true });
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };
    
        const intervalId = setInterval(() => {
            checkAuth();
        }, 5 * 60 * 1000);
    
        checkAuth();
    
        return () => clearInterval(intervalId);
    }, []);

    const login = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URI}shop/orders`, {
                withCredentials: true 
            });
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URI}logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error("Erreur lors de la déconnexion", err);
        }
        setIsAuthenticated(false);
        navigate("/connexion");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
