import { notFound } from "next/navigation";
import PasswordResetForm from "@/app/(guest)/password-reset/client";

import { verifyJWT } from "@plan-prise/api/utils/json-web-token";

const PasswordReset = async ({
  searchParams,
}: {
  searchParams?: { email?: string; success?: string; token?: string };
}) => {
  const email = searchParams?.email;
  const token = searchParams?.token;

  if (email && token && (await verifyJWT(token))) {
    return <PasswordResetForm email={email} token={token} />;
  }

  return notFound();
};

export default PasswordReset;

export const metadata = {
  title: "Réinitialisation du mot de passe",
};
