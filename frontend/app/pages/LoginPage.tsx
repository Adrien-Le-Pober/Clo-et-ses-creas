import LoginForm from "~/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center mx-2 sm:mx-0">
            <h1 className="text-3xl lg:text-4xl py-16">Connexion</h1>
            <LoginForm />
        </div>
    );
}
