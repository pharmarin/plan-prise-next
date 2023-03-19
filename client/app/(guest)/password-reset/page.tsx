import EditPassword from "@/app/(auth)/profil/EditPassword";
import PP_Error from "@/utils/errors";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

const PasswordReset: React.FC<{
  searchParams?: { email?: string; token?: string };
}> = ({ searchParams }) => {
  const email = searchParams?.email;
  const token = searchParams?.token;

  if (!email || !token) {
    throw new PP_Error("USER_RESET_PASSWORD_MISSING_PARAMS");
  }

  if (jwt.verify(token, process.env.NEXTAUTH_SECRET || "")) {
    return <EditPassword email={email} token={token} />;
  }

  return notFound();
};

export default PasswordReset;
