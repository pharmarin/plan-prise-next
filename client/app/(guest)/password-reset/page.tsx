"use client";

import EditPassword from "app/(auth)/profil/EditPassword";
import PasswordResetErrorMissingParam from "common/errors/PasswordResetErrorMissingParam";
import { useSearchParams } from "next/navigation";

const PasswordReset = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    throw new PasswordResetErrorMissingParam();
  }

  return <EditPassword email={email} token={token} />;
};
export default PasswordReset;
