import Form from "components/forms/Form";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import ServerErrors from "components/forms/ServerErrors";
import Modal from "components/overlays/modals/Modal";
import ModalContent from "components/overlays/modals/ModalContent";
import ModalFooter from "components/overlays/modals/ModalFooter";
import { Formik } from "formik";
import { Errors } from "jsonapi-typescript";
import React from "react";
import * as yup from "yup";

const ConfirmPasswordModal: React.FC<{
  errors?: Errors;
  onCancel: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  show: boolean;
}> = ({ errors, onCancel, onSubmit, show }) => {
  return (
    <Formik
      initialValues={{ password: "" }}
      onSubmit={async ({ password }) => {
        await onSubmit(password);
      }}
      validationSchema={yup.object().shape({
        password: yup.string().required().label("Mot de passe"),
      })}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Modal show={show}>
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <div className="space-y-2 text-sm">
                <p>
                  Nous vous demandons de confirmer votre mot de passe avant de
                  procéder à la suppression de votre compte.
                </p>
                <p>
                  Une fois la procédure amorcée, toutes les données rattachées à
                  votre compte seront définitivement supprimées.
                </p>
                <p className="text-red-600">
                  Aucune annulation n'est possible après avoir confirmé la
                  suppression de votre compte.
                </p>
              </div>
              <div className="mt-4">
                <FormikField
                  disableOnSubmit
                  displayErrors
                  label="Confirmez votre mot de passe"
                  name="password"
                  type="password"
                />
                <ServerErrors errors={errors} />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button color="red" loading={isSubmitting} type="submit">
                Confirmer
              </Button>
              <Button color="white" onClick={onCancel}>
                Annuler
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default ConfirmPasswordModal;
