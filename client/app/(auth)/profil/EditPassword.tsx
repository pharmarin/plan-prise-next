import { AxiosError } from "axios";
import Form from "components/forms/Form";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import ServerErrors from "components/forms/ServerErrors";
import { Formik } from "formik";
import { DocWithErrors, Errors } from "jsonapi-typescript";
import User from "lib/redux/models/User";
import { useState } from "react";
import * as yup from "yup";

const EditPassword: React.FC<
  { user: User } | { email: string; token: string }
> = (props) => {
  const [errors, setErrors] = useState<Errors | undefined>(undefined);

  return (
    <Formik
      initialValues={{
        current_password: "",
        email: "email" in props ? props.email : "",
        password: "",
        password_confirmation: "",
        token: "token" in props ? props.token : "",
      }}
      onSubmit={async (values) => {
        setErrors(undefined);

        "user" in props
          ? await props.user
              .patch(
                {
                  ...props.user.identifier,
                  attributes: {
                    current_password: values.current_password,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                  },
                },
                "/users/update-password"
              )
              .catch((error: AxiosError<DocWithErrors>) => {
                setErrors(error.response?.data.errors);
              })
          : new User().post({
              type: "users",
              attributes: {
                email: values.email,
                password: values.password,
                password_confirmation: values.password_confirmation,
                token: values.token,
              },
            });
      }}
      validationSchema={yup.object().shape({
        current_password: yup.string().required().label("Mot de passe actuel"),
        password: yup
          .string()
          .min(8)
          .max(20)
          .required()
          .label("Nouveau mot de passe"),
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password")])
          .required()
          .label("Confirmation du nouveau mot de passe"),
      })}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <FormikField
            autoComplete="current-password"
            disableOnSubmit
            displayErrors
            label="Mot de passe actuel"
            name="current_password"
            placeholder="Mot de passe actuel"
            type="password"
          />
          <input
            autoComplete="off"
            name="email"
            type="hidden"
            value={"user" in props ? props.user.email : props.email}
          />
          <FormikField
            autoComplete="new-password"
            disableOnSubmit
            displayErrors
            label="Nouveau mot de passe"
            name="password"
            placeholder="Nouveau mot de passe"
            type="password"
          />
          <FormikField
            autoComplete="new-password"
            disableOnSubmit
            displayErrors
            label="Confirmation"
            name="password_confirmation"
            placeholder="Confirmation du nouveau mot de passe"
            type="password"
          />
          <ServerErrors errors={errors} />
          <Button color="primary" loading={isSubmitting} type="submit">
            Mettre à jour le mot de passe
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditPassword;
