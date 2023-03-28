import EditPassword from "@/app/(auth)/profil/EditPassword";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

const PasswordReset: React.FC<{
  searchParams?: { email?: string; token?: string };
}> = ({ searchParams }) => {
  const email = searchParams?.email;
  const token = searchParams?.token;

  if (email && token && jwt.verify(token, process.env.NEXTAUTH_SECRET || "")) {
    return <EditPassword email={email} token={token} />;
  }

  return notFound();
};

export default PasswordReset;
