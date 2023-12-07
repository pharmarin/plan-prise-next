import { notFound } from "next/navigation";
import LinkExpired from "@/app/(guest)/password-reset/LinkExpired";
import PasswordResetForm from "@/app/(guest)/password-reset/PasswordResetForm";

import { verifyJWT } from "@plan-prise/api/utils/json-web-token";
import FormSubmitSuccess from "@plan-prise/ui/components/forms/FormSubmitSuccess";
import Link from "@plan-prise/ui/components/navigation/Link";

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
          <>
            <p>
              Vous pouvez maintenant vous connecter avec votre nouveau mot de
              passe.
            </p>
            <Link href="/login">Se connecter</Link>
          </>
        }
        title="Réinitialisation du mot de passe terminée"
      />
    );
  }

  try {
    if (email && token && (await verifyJWT(token))) {
      return <PasswordResetForm email={email} token={token} />;
    }
  } catch (error) {
    return <LinkExpired />;
  }

  return notFound();
};

export default PasswordReset;

export const metadata = {
  title: "Réinitialisation du mot de passe",
};
