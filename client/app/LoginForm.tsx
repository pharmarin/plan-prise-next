"use client";

import AskPasswordResetForm from "app/AskPasswordResetForm";
import Form from "components/forms/Form";
import Button from "components/forms/inputs/Button";
import CheckboxInput from "components/forms/inputs/CheckboxInput";
import FormikField from "components/forms/inputs/FormikField";
import TextInput from "components/forms/inputs/TextInput";
import ServerErrors from "components/forms/ServerErrors";
import { Formik } from "formik";
import { loginUserAction } from "lib/redux/auth/actions";
import { selectLoginError } from "lib/redux/auth/selectors";
import { useDispatch } from "lib/redux/store";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";

const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const loginErrors = useSelector(selectLoginError);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return <AskPasswordResetForm className={className} />;
  }

  return (
    <>
      <Formik
        initialValues={{
          email: searchParams.get("email") ?? "",
          password: searchParams.get("password") ?? "",
          remember: false,
        }}
        onSubmit={async (values) => dispatch(loginUserAction(values))}
        validateOnMount
        validationSchema={yup.object().shape({
          email: yup.string().email().required().label("Adresse mail"),
          password: yup.string().required(),
        })}
      >
        {({ errors, handleSubmit, isSubmitting }) => (
          <Form className={className} onSubmit={handleSubmit}>
            <h3 className="mb-4 text-center text-lg font-bold">Connexion</h3>

            <div className="space-y-2">
              <FormikField
                id="login_email"
                label="Adresse mail"
                name="email"
                placeholder="Adresse mail"
                required
                type="email"
              >
                <TextInput slideLabel />
              </FormikField>
              <FormikField
                id="login_password"
                label="Mot de passe"
                name="password"
                placeholder="Mot de passe"
                required
                type="password"
              >
                <TextInput slideLabel />
              </FormikField>
              <Button
                className="!mt-1 text-xs"
                color="link"
                onClick={() => setShowForgotPassword(true)}
                type="button"
              >
                Mot de passe oublié ?
              </Button>
              <FormikField
                id="login_remember"
                label="Rester connecté"
                name="remember"
              >
                <CheckboxInput wrapperClassName="justify-center" />
              </FormikField>
            </div>

            <Button
              className="mt-4"
              color="gradient"
              disabled={"email" in errors || "password" in errors}
              loading={isSubmitting}
              type="submit"
            >
              Se connecter
            </Button>

            <ServerErrors errors={loginErrors} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
