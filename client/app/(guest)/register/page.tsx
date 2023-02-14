"use client";

import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { AxiosError } from "axios";
import Form from "components/forms/Form";
import FormInfo from "components/forms/FormInfo";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import ServerErrors from "components/forms/ServerErrors";
import { Formik } from "formik";
import { DocWithErrors } from "jsonapi-typescript";
import { fetchCsrfCookie } from "lib/redux/auth/actions";
import User from "lib/redux/models/User";
import { RegisterAttributes } from "lib/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import ReCAPTCHA from "react-google-recaptcha";
import { twMerge } from "tailwind-merge";
import * as yup from "yup";

const Register = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    execute: register,
    error: serverErrors,
    result: data,
  } = useAsyncCallback(async (data: RegisterAttributes) => {
    await fetchCsrfCookie().catch((errors: AxiosError<DocWithErrors>) =>
      Promise.reject(errors.response?.data.errors)
    );

    return await new User()
      .register(data)
      .then(() => "success")
      .catch((errors: AxiosError<DocWithErrors>) =>
        Promise.reject(errors.response?.data.errors)
      );
  });

  const ALLOWED_FILE_TYPES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
  ];

  if (data === "success") {
    return (
      <div className={twMerge("space-y-2 text-gray-900")}>
        <h4 className="mt-2 flex items-center font-medium">
          <CheckBadgeIcon className="mr-1 h-4 w-4 text-teal-500" />
          <span>Demande d'inscription terminée</span>
        </h4>
        <p>
          Votre demande d'inscription sur plandeprise.fr est maintenant
          terminée. Nous allons examiner votre demande dans les plus brefs
          délais.
        </p>
        <p className="text-gray-700">
          Vous recevrez prochainement un mail vous informant de l'activation de
          votre compte.
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
          if (!reCaptchaRef) {
            throw new Error("Le service ReCAPTCHA n'a pas pu être chargé");
          }

          setSubmitting(true);

          if (!reCaptchaRef.current?.getValue()) {
            await (reCaptchaRef.current as ReCAPTCHA).executeAsync();
          }

          try {
            await register({
              ...values,
              recaptcha: reCaptchaRef.current?.getValue() || "",
            });

            setSubmitting(false);
          } catch {
            setSubmitting(false);
          }

          reCaptchaRef.current?.reset();
        }}
        validateOnMount
        validationSchema={yup.object().shape({
          firstName: yup.string().required().max(50).label("Prénom"),
          lastName: yup.string().required().max(50).label("Nom"),
          student: yup.boolean(),
          rpps: yup.mixed().when("student", {
            is: false,
            then: yup.string().required().min(11).max(11).label("RPPS"),
          }),
          certificate: yup.mixed().when("student", {
            is: true,
            then: yup
              .mixed()
              .required()
              .test("fileSize", (value) =>
                "size" in (value || {}) ? value.size <= 2000000 : false
              )
              .test("fileType", (value) =>
                "type" in (value || {})
                  ? ALLOWED_FILE_TYPES.includes(value.type)
                  : false
              )
              .label("Certificat de scolarité"),
          }),
          display_name: yup
            .string()
            .notRequired()
            .min(3)
            .max(50)
            .label("Nom de la structure"),
          email: yup.string().email().required().label("Email"),
          password: yup
            .string()
            .min(8)
            .max(20)
            .required()
            .label("Mot de passe"),
          password_confirmation: yup
            .string()
            .oneOf([yup.ref("password")])
            .required()
            .label("Confirmation du mot de passe"),
        })}
      >
        {({ errors, handleSubmit, isSubmitting, values }) => (
          <Form className="flex flex-col" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-center text-xl font-bold">Inscription</h3>
              <ReCAPTCHA
                ref={reCaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ""}
              />
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

                <ServerErrors errors={serverErrors as any} />

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
        J'ai déjà un compte : Se connecter
      </Button>
    </>
  );
};

export default Register;
