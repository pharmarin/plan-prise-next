"use client";

import { useState } from "react";
import ServerError from "@/app/_components/ServerError";
import { trpc } from "@/utils/api";
import convertToBase64 from "@/utils/file-to-base64";
import { Formik } from "formik";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import {
  ALLOWED_UPLOADED_FILE_TYPES,
  MAX_UPLOADED_FILE_SIZE,
  registerSchemaClient,
} from "@plan-prise/api/validation/users";
import PP_Error from "@plan-prise/errors";
import Form from "@plan-prise/ui/components/forms/Form";
import FormSubmitSuccess from "@plan-prise/ui/components/forms/FormSubmitSuccess";
import FormikField from "@plan-prise/ui/components/forms/inputs/FormikField";
import Link from "@plan-prise/ui/components/navigation/Link";
import { Button } from "@plan-prise/ui/shadcn/ui/button";

const RegisterForm = () => {
  const [step, setStep] = useState(1);

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
        onSubmit={async (values) => {
          let convertedCertificate: string | null = null;

          if (!executeRecaptcha) {
            throw new PP_Error("RECAPTCHA_LOADING_ERROR");
          }

          const recaptcha = await executeRecaptcha("enquiryFormSubmit");

          if (
            values.certificate &&
            (values.certificate as Blob).size < MAX_UPLOADED_FILE_SIZE
          ) {
            convertedCertificate = await convertToBase64(values.certificate);
          }

          await mutateAsync({
            ...values,
            certificate: convertedCertificate,
            recaptcha,
          });
        }}
        validateOnMount
        validationSchema={registerSchemaClient}
      >
        {({ errors, handleSubmit, isSubmitting, values }) => (
          <Form className="flex flex-col" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-center text-xl font-bold">Inscription</h3>
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
                  <FormikField
                    accept={ALLOWED_UPLOADED_FILE_TYPES.join(",")}
                    disableOnSubmit
                    displayErrors
                    label="Justificatif d'études de pharmacie"
                    name="certificate"
                    placeholder="Ajouter un fichier... "
                    type="file"
                  />
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
                  <p className="mt-1 text-xs text-muted-foreground">
                    Si indiqué, le nom de la structure apparaitra à la place de
                    votre nom sur le plan de prise
                  </p>
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
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ne sera jamais utilisée ou diffusée.
                  </p>
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

                {error && <ServerError error={error} />}

                <div className="flex gap-4">
                  <Button
                    className="flex-none"
                    onClick={() => setStep(1)}
                    variant="outline"
                  >
                    Retour
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!errors}
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
      <Link className="mt-4" href="/login">
        J&apos;ai déjà un compte : Se connecter
      </Link>
    </>
  );
};

export default RegisterForm;
