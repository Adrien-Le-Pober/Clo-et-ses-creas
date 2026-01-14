export interface SignUpFormData {
    email: string;
    password: string;
    firstName: string,
    lastName: string,
    rgpd?: boolean,
}

export interface LoginFormData {
    email: string;
    password: string;
}