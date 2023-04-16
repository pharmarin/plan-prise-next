import PasswordResetForm from "@/app/(guest)/password-reset/PasswordResetForm";
import FormSubmitSuccess from "@/components/forms/FormSubmitSuccess";
import { verifyJWT } from "@/utils/json-web-token";
import { notFound } from "next/navigation";

const PasswordReset = async ({
  searchParams,
}: {
  searchParams?: { email?: string; success?: string; token?: string };
}) => {
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

  if (email && token && (await verifyJWT(token))) {
    return <PasswordResetForm email={email} token={token} />;
  }

  return notFound();
};

export default PasswordReset;

export const metadata = {
  title: "Réinitialisation du mot de passe",
};
