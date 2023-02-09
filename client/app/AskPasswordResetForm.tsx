import Form from "components/forms/Form";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import TextInput from "components/forms/inputs/TextInput";
import { Formik } from "formik";
import User from "lib/redux/models/User";
import * as yup from "yup";

const AskPasswordResetForm: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Formik
      initialValues={{
        email: "",
      }}
      onSubmit={async (values) => {
        await new User().forgotPassword(values.email);
      }}
      validationSchema={yup.object().shape({
        email: yup.string().email().required().label("Adresse mail"),
      })}
    >
      {({ errors, handleSubmit, isSubmitting }) => (
        <Form className={className} onSubmit={handleSubmit}>
          <h3 className="mb-4 text-center text-lg font-bold">
            Mot de passe oublié
          </h3>

          <FormikField
            id="reset_email"
            label="Adresse mail"
            name="email"
            placeholder="Adresse mail"
            required
            type="email"
          >
            <TextInput />
          </FormikField>

          <Button
            className="mt-4"
            color="gradient"
            disabled={"email" in errors}
            loading={isSubmitting}
            type="submit"
          >
            Envoyer le mail de réinitialisation
          </Button>
        </Form>
      )}
    </Formik>
  );
};
export default AskPasswordResetForm;
