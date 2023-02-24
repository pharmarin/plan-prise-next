"use client";

import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import ReCaptchaNotLoaded from "common/errors/ReCaptchaNotLoaded";
import { trpc } from "common/trpc";
import { ALLOWED_FILE_TYPES, registerSchema } from "common/validation/auth";
import Form from "components/forms/Form";
import FormInfo from "components/forms/FormInfo";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { twMerge } from "tailwind-merge";

const Register = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { mutateAsync, error, data } = trpc.auth.register.useMutation();

  if (data === "success") {
    return (
      <div className={twMerge("space-y-2 text-gray-900")}>
        <h4 className="mt-2 flex items-center font-medium">
          <CheckBadgeIcon className="mr-1 h-4 w-4 text-teal-500" />
          <span>Demande d&apos;inscription terminée</span>
        </h4>
        <p>
          Votre demande d&apos;inscription sur plandeprise.fr est maintenant
          terminée. Nous allons examiner votre demande dans les plus brefs
          délais.
        </p>
        <p className="text-gray-700">
          Vous recevrez prochainement un mail vous informant de
          l&apos;activation de votre compte.
        </p>
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          firstName: "",
          lastName: "",
          rpps: "",
          certificate: undefined,
          student: false,
          displayName: "",
          password: "",
          password_confirmation: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          if (!executeRecaptcha) {
            throw new ReCaptchaNotLoaded();
          }

          const recaptcha = await executeRecaptcha("enquiryFormSubmit");

          await mutateAsync({ ...values, recaptcha });
        }}
        validateOnMount
        validationSchema={registerSchema}
      >
        {({ errors, handleSubmit, isSubmitting, values }) => (
          <Form className="flex flex-col" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-center text-xl font-bold">Inscription</h3>
              {/* <ReCAPTCHA
                ref={reCaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""}
              /> */}
            </div>

            {step === 1 && (
              <>
                <div>
                  <h4 className="font-medium text-gray-900">
                    <span className="font-bold text-gray-500">1/2</span> Votre
                    identité
                  </h4>
                  <p className="text-sm text-gray-600">
                    Permettra de valider votre inscription
                  </p>
                </div>
                <FormikField
                  autoComplete="family-name"
                  disableOnSubmit
                  displayErrors
                  label="Nom"
                  name="lastName"
                  placeholder="Nom"
                  required
                />
                <FormikField
                  autoComplete="given-name"
                  disableOnSubmit
                  displayErrors
                  label="Prénom"
                  name="firstName"
                  placeholder="Prénom"
                  required
                />
                <FormikField
                  id="status_pharmacist"
                  disableOnSubmit
                  displayErrors
                  label="Étudiant"
                  name="student"
                  type="checkbox"
                />
                {values.student ? (
                  <div className="mb-4">
                    <FormikField
                      accept={ALLOWED_FILE_TYPES.join(",")}
                      disableOnSubmit
                      displayErrors
                      label="Justificatif d'études de pharmacie"
                      name="certificate"
                      placeholder="Ajouter un fichier... "
                      type="file"
                    />
                  </div>
                ) : (
                  <FormikField
                    autoComplete="off"
                    disableOnSubmit
                    displayErrors
                    label="N° RPPS"
                    name="rpps"
                    placeholder="N° RPPS"
                  />
                )}
                <Button
                  color="primary"
                  disabled={
                    errors.firstName !== undefined ||
                    errors.lastName !== undefined ||
                    errors.rpps !== undefined ||
                    errors.certificate !== undefined
                  }
                  onClick={() => setStep(2)}
                  type="submit"
                >
                  Valider
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <h4 className="font-medium text-gray-900">
                  <span className="font-bold text-gray-500">2/2</span> Votre
                  profil
                </h4>
                <div>
                  <FormikField
                    autoComplete="off"
                    disableOnSubmit
                    displayErrors
                    label="Nom de la structure (optionnel)"
                    name="displayName"
                    placeholder="Nom de la structure"
                  />
                  <FormInfo>
                    Si indiqué, le nom de la structure apparaitra à la place de
                    votre nom sur le plan de prise
                  </FormInfo>
                </div>
                <div>
                  <FormikField
                    autoComplete="email"
                    disableOnSubmit
                    displayErrors
                    label="Adresse mail"
                    name="email"
                    placeholder="Adresse mail"
                    type="email"
                  />
                  <FormInfo>Ne sera jamais utilisée ou diffusée.</FormInfo>
                </div>
                <FormikField
                  autoComplete="new-password"
                  disableOnSubmit
                  displayErrors
                  label="Mot de passe"
                  name="password"
                  placeholder="Mot de passe"
                  type="password"
                />
                <FormikField
                  autoComplete="new-password"
                  disableOnSubmit
                  displayErrors
                  label="Confirmation du mot de passe"
                  name="password_confirmation"
                  placeholder="Confirmation du mot de passe"
                  type="password"
                />

                {error &&
                  ["CONFLICT", "INTERNAL_SERVER_ERROR"].includes(
                    error.data?.code || ""
                  ) && <FormInfo color="red">{error.message}</FormInfo>}

                <div className="flex gap-4">
                  <Button
                    className="flex-none"
                    color="white"
                    onClick={() => setStep(1)}
                  >
                    Retour
                  </Button>
                  <Button
                    className="flex-1"
                    color="primary"
                    loading={isSubmitting}
                    type="submit"
                  >
                    Demander mon inscription
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
      <Button
        className="mt-4"
        color="link"
        onClick={() => router.push("/login")}
      >
        J&apos;ai déjà un compte : Se connecter
      </Button>
    </>
  );
};

export default Register;
