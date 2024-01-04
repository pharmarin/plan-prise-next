"use client";

import { useState } from "react";
import RegisterFormStep1 from "@/app/(guest)/register/form-1";
import RegisterFormStep2 from "@/app/(guest)/register/form-2";
import { trpc } from "@/utils/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { z } from "zod";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import type { registerSchema } from "@plan-prise/api/validation/users";
import PP_Error from "@plan-prise/errors";
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

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { mutateAsync, error, data } = trpc.users.register.useMutation();

  if (data === MUTATION_SUCCESS) {
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
    <div>
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
          serverError={error?.message}
          setFormData={(values) =>
            setFormData((state) => ({ ...state, ...values }))
          }
          setPreviousStep={() => setStep(1)}
          submitForm={async (step2Values) => {
            if (!executeRecaptcha) {
              throw new PP_Error("RECAPTCHA_LOADING_ERROR");
            }

            const recaptcha = await executeRecaptcha("enquiryFormSubmit");

            await mutateAsync({
              ...formData,
              ...step2Values,
              recaptcha,
            });
          }}
        />
      )}
      <Link className="mt-4" href="/login">
        J&apos;ai déjà un compte : Se connecter
      </Link>
    </div>
  );
};

export default RegisterForm;
