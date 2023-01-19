import { AxiosError } from "axios";
import Form from "components/forms/Form";
import FormInfo from "components/forms/FormInfo";
import Button, { BUTTON_LINK_CLASSNAME } from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import TextInput from "components/forms/inputs/TextInput";
import { Formik } from "formik";
import { DocWithErrors, Errors } from "jsonapi-typescript";
import { setUser } from "lib/redux/auth/slice";
import User from "lib/redux/models/User";
import { useDispatch } from "lib/redux/store";
import { UserObject } from "lib/types";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import * as yup from "yup";

const EditInformations: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Errors | undefined>(undefined);

  if (!user) {
    return <span>Erreur lors du chargement... </span>;
  }

  const initialValues = {
    displayName: user.displayName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    rpps: user.rpps,
    student: user.student,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values, { setSubmitting }) => {
        setErrors(undefined);
        setSubmitting(true);

        console.log("values: ", values);
        user.assignAttributes(values);

        user
          .save()
          .then((response) => {
            if ("data" in response) {
              return dispatch(setUser(response.data as UserObject));
            }

            setErrors([
              {
                title:
                  "Une erreur inconnue est survenue lors de la mise à jour l'utilisateur. ",
              },
            ]);
          })
          .catch((error: AxiosError<DocWithErrors>) =>
            setErrors(error.response?.data.errors)
          );
      }}
      validateOnMount
      validationSchema={yup.object().shape({
        firstName: yup.string().required().min(3).max(50).label("Prénom"),
        lastName: yup.string().required().min(3).max(50).label("Nom"),
        student: yup.boolean().required().label("Étudiant"),
        rpps: yup
          .mixed()
          .when("student", {
            is: false,
            then: yup
              .string()
              .matches(/^[0-9]+$/, "RPPS ne doit contenir que des chiffres")
              .required()
              .min(11)
              .max(11),
          })
          .label("RPPS"),
        displayName: yup
          .string()
          .notRequired()
          .min(3)
          .max(50)
          .label("Nom de la structure"),
        email: yup.string().email().required().label("Adresse mail"),
      })}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <FormikField
            autoComplete="last-name"
            disableOnSubmit
            displayErrors
            label="Nom"
            name="lastName"
            placeholder="Nom"
            required
          >
            <TextInput />
          </FormikField>
          <FormikField
            autoComplete="first-name"
            disableOnSubmit
            displayErrors
            label="Prénom"
            name="firstName"
            placeholder="Prénom"
            required
          >
            <TextInput />
          </FormikField>
          <TextInput
            disabled
            label="Statut"
            name="student"
            value={values.student ? "Étudiant" : "Pharmacien"}
          />
          {values.student && (
            <Button
              className={twMerge(BUTTON_LINK_CLASSNAME, "mt-2")}
              onClick={() => setFieldValue("student", false)}
            >
              Modifier en compte pharmacien
            </Button>
          )}
          {!values.student && (
            <FormikField
              autoComplete="off"
              disableOnSubmit
              displayErrors
              label="N° RPPS"
              name="rpps"
              placeholder="N° RPPS"
            >
              <TextInput />
            </FormikField>
          )}
          <FormikField
            autoComplete="off"
            disableOnSubmit
            displayErrors
            label="Nom de la structure (optionnel)"
            name="displayName"
            placeholder="Nom de la structure"
          >
            <TextInput info="Si indiqué, le nom de la structure apparaitra à la place de votre nom sur le plan de prise" />
          </FormikField>

          <FormikField
            autoComplete="email"
            disableOnSubmit
            displayErrors
            label="Adresse mail"
            name="email"
            placeholder="Adresse mail"
            type="email"
          >
            <TextInput />
          </FormikField>
          {errors && (
            <div>
              {(errors || []).map((errorItem: any, key: any) => (
                <FormInfo key={key} className="text-red-600">
                  {errorItem.title}
                </FormInfo>
              ))}
            </div>
          )}
          <Button gradient loading={isSubmitting} type="submit">
            Mettre à jour les informations
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditInformations;
