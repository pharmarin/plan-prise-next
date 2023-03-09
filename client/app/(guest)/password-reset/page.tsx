"use client";

import EditPassword from "@/app/(auth)/profil/EditPassword";
import PP_Error from "@plan-prise/utils/errors";
import { useSearchParams } from "next/navigation";

const PasswordReset = () => {
  const searchParams = useSearchParams();

  const email = searchParams?.get("email");
  const token = searchParams?.get("token");

  if (!email || !token) {
    throw new PP_Error("USER_RESET_PASSWORD_MISSING_PARAMS");
  }

  return <EditPassword email={email} token={token} />;
};
export default PasswordReset;
