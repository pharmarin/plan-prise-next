"use client";

import Form from "@/components/forms/Form";
import FormikField from "@/components/forms/inputs/FormikField";
import TextInput from "@/components/forms/inputs/TextInput";
import ServerError from "@/components/forms/ServerError";
import InfosModal from "@/components/overlays/modals/InfosModal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { updateUserSchema } from "@/validation/users";
import { type User } from "@prisma/client";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const EditInformations: React.FC<{
  user: User;
}> = ({ user }) => {
  const [showModal, setShowModal] = useState<true | false | undefined>(
    undefined,
  );

  const trpcContext = trpc.useContext();
  const { error, mutateAsync } = trpc.users.update.useMutation();

  useEffect(() => {
    if (showModal === undefined && user) {
      if (
        (user.firstName || "").length > 0 &&
        (user.lastName || "").length > 0
      ) {
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    }
  }, [showModal, user]);

  if (!user) {
    return <span>Erreur lors du chargement... </span>;
  }

  const initialValues = {
    displayName: user.displayName || "",
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    rpps: user.rpps?.toString() || "",
    student: user.student || false,
  };

  return (
    <>
      <InfosModal
        content={
          <>
            <p>
              Suite à des changements sur le site plandeprise.fr nous avons
              besoin de connaitre votre nom et votre prénom.
            </p>
            <p>
              Ils apparaitront sur les plans de prise ou calendriers exportés
              sauf si vous remplissez le champ &quot;Nom de la structure&quot;.
            </p>
          </>
        }
        footer={
          <Button
            className="w-full sm:ml-3 sm:mt-0 sm:w-auto"
            onClick={() => setShowModal(false)}
          >
            Mettre à jour mes informations
          </Button>
        }
        show={showModal || false}
        title="Information importante"
        toggle={() => setShowModal(!showModal)}
      />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values) => {
          await mutateAsync({ id: user.id, ...values });

          await trpcContext.users.current.invalidate();
        }}
        validateOnMount
        validationSchema={updateUserSchema()}
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
            />
            <FormikField
              autoComplete="first-name"
              disableOnSubmit
              displayErrors
              label="Prénom"
              name="firstName"
              placeholder="Prénom"
              required
            />
            <TextInput
              disabled
              label="Statut"
              name="student"
              value={values.student ? "Étudiant" : "Pharmacien"}
            />
            {values.student && (
              <Button
                className={twMerge("mt-2")}
                onClick={() => setFieldValue("student", false)}
                variant="link"
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
              />
            )}
            <FormikField
              autoComplete="off"
              disableOnSubmit
              displayErrors
              info="Si indiqué, le nom de la structure apparaitra à la place de votre nom sur le plan de prise"
              label="Nom de la structure (optionnel)"
              name="displayName"
              placeholder="Nom de la structure"
            />

            <FormikField
              autoComplete="email"
              disableOnSubmit
              displayErrors
              label="Adresse mail"
              name="email"
              placeholder="Adresse mail"
              type="email"
            />

            {error && <ServerError error={error} />}

            <Button loading={isSubmitting} type="submit">
              Mettre à jour les informations
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditInformations;
