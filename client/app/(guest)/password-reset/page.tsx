import PasswordResetForm from "@/app/(guest)/password-reset/PasswordResetForm";
import FormSubmitSuccess from "@/components/forms/FormSubmitSuccess";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

const PasswordReset: React.FC<{
  searchParams?: { email?: string; success?: string; token?: string };
}> = ({ searchParams }) => {
  const email = searchParams?.email;
  const token = searchParams?.token;

  if (searchParams && "success" in searchParams) {
    return (
      <FormSubmitSuccess
        content={
          <p>
            Vous pouvez maintenant vous connecter avec votre nouveau mot de
            passe.
          </p>
        }
        title="Réinitialisation du mot de passe terminée"
      />
    );
  }

  if (email && token && jwt.verify(token, process.env.NEXTAUTH_SECRET || "")) {
    return <PasswordResetForm email={email} token={token} />;
  }

  return notFound();
};

export default PasswordReset;

export const metadata = {
  title: "Réinitialisation du mot de passe",
};
