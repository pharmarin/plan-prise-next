"use client";

import Button from "@/components/forms/inputs/Button";
import { TokenExpiredError } from "jsonwebtoken";
import { useRouter } from "next/navigation";

const ResetPasswordError: React.FC<{ error: Error }> = ({ error }) => {
  console.log("error: ", JSON.stringify(error.message), TokenExpiredError.name);

  const router = useRouter();

  if (error.message === "jwt expired") {
    return (
      <div>
        <p className="mb-4 text-center text-red-600">Ce lien a expiré.</p>
        <Button onClick={() => router.push("/forgot-password")}>
          Demander un nouveau mot de passe
        </Button>
      </div>
    );
  }

  throw new Error();
};
export default ResetPasswordError;
