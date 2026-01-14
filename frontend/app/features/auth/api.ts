import axios from "axios";
import type { SignUpFormData } from "./types";

const API = import.meta.env.VITE_API_URI;

export async function signUp(data: SignUpFormData) {
    return axios.post(`${API}shop/customers`, data);
}

export async function login(email: string, password: string) {
    return axios.post(
        `${API}shop/customers/token`,
        { email, password },
        { withCredentials: true }
    );
}