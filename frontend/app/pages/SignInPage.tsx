import SignUpForm from "~/features/auth/components/SignUpForm";

export default function SignInPage() {
    return (
        <section className="flex flex-col items-center">
            <h1 className="text-3xl lg:text-4xl py-16">Inscription</h1>
            <SignUpForm />
        </section>
    )
}