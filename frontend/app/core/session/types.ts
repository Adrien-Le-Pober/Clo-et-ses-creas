export type AuthProvider =
    | "password"
    | "google";

export interface Identity {
    id: string;
    email: string;
    provider: AuthProvider;
}

export interface Session {
    identity: Identity | null;
}