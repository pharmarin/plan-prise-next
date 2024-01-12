"use client";

import { useState } from "react";
import RegisterFormStep1 from "@/app/(guest)/register/form-1";
import RegisterFormStep2 from "@/app/(guest)/register/form-2";
import type { z } from "zod";

import type { registerSchema } from "@plan-prise/api/validation/users";
import Link from "@plan-prise/ui/components/navigation/Link";
import FormSubmitSuccess from "@plan-prise/ui/components/pages/FormSubmitSuccess";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<z.infer<typeof registerSchema>>({
    email: "",
    firstName: "",
    lastName: "",
    rpps: "",
    certificate: undefined,
    student: false,
    displayName: "",
    password: "",
    password_confirmation: "",
  });

  if (step === 3) {
    return (
      <FormSubmitSuccess
        content={
          <>
            <p>
              Votre demande d&apos;inscription sur plandeprise.fr est maintenant
              terminée. Nous allons examiner votre demande dans les plus brefs
              délais.
            </p>
            <p className="text-gray-700">
              Vous recevrez prochainement un mail vous informant de
              l&apos;activation de votre compte.
            </p>
          </>
        }
        title="Demande d'inscription terminée"
      />
    );
  }

  return (
    <div className="mx-auto md:w-2/3">
      {step === 1 && (
        <RegisterFormStep1
          formData={formData}
          setFormData={(values) =>
            setFormData((state) => ({ ...state, ...values }))
          }
          setNextStep={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <RegisterFormStep2
          formData={formData}
          setFormData={(values) =>
            setFormData((state) => ({ ...state, ...values }))
          }
          setNextStep={() => setStep(3)}
          setPreviousStep={() => setStep(1)}
        />
      )}
      <Link className="mt-4" href="/login">
        J&apos;ai déjà un compte : Se connecter
      </Link>
    </div>
  );
};

export default RegisterForm;
