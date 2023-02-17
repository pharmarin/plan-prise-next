"use client";

import Form from "components/forms/Form";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import ServerErrors from "components/forms/ServerErrors";
import { Formik } from "formik";
import { loginUserAction } from "lib/redux/auth/actions";
import { selectLoginError } from "lib/redux/auth/selectors";
import { useDispatch } from "lib/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import * as yup from "yup";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginErrors = useSelector(selectLoginError);

  return (
    <>
      <Formik
        initialValues={{
          email: searchParams.get("email") ?? "",
          password: searchParams.get("password") ?? "",
          remember: false,
        }}
        onSubmit={async (values) => {
          try {
            await dispatch(loginUserAction(values));

            router.push(searchParams.get("redirectTo") ?? "/");
          } catch (error) {}
        }}
        validateOnMount
        validationSchema={yup.object().shape({
          email: yup.string().email().required().label("Adresse mail"),
          password: yup.string().required(),
        })}
      >
        {({ errors, handleSubmit, isSubmitting }) => (
          <Form
            className="flex flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <h3 className="mb-4 text-center text-lg font-bold">Connexion</h3>

            <div className="space-y-2">
              <FormikField
                id="login_email"
                label="Adresse mail"
                name="email"
                placeholder="Adresse mail"
                required
                slideLabel
                type="email"
              />
              <FormikField
                id="login_password"
                label="Mot de passe"
                name="password"
                placeholder="Mot de passe"
                required
                slideLabel
                type="password"
              />
              <Button
                className="!mt-1 px-0 py-0 text-xs"
                color="link"
                onClick={() => router.push("/forgot-password")}
              >
                Mot de passe oublié ?
              </Button>
              <FormikField
                id="login_remember"
                label="Rester connecté"
                name="remember"
                type="checkbox"
                wrapperClassName="justify-center"
              />
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
      <Button
        className="mt-4"
        color="link"
        onClick={() => router.push("/register")}
      >
        Je n&apos;ai pas de compte : S&apos;inscrire
      </Button>
    </>
  );
};

export default Login;
