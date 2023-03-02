import { TRPCClientErrorLike } from "@trpc/react-query";
import { passwordVerifySchema } from "common/validation/auth";
import Form from "components/forms/Form";
import FormInfo from "components/forms/FormInfo";
import Button from "components/forms/inputs/Button";
import FormikField from "components/forms/inputs/FormikField";
import Modal from "components/overlays/modals/Modal";
import ModalContent from "components/overlays/modals/ModalContent";
import ModalFooter from "components/overlays/modals/ModalFooter";
import { Formik } from "formik";
import React from "react";
import { AppRouter } from "server/trpc/routers/app";

const ConfirmPasswordModal: React.FC<{
  error?: TRPCClientErrorLike<AppRouter["auth"]["passwordVerify"]> | null;
  onCancel: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  show: boolean;
}> = ({ error, onCancel, onSubmit, show }) => {
  return (
    <Formik
      initialValues={{ password: "" }}
      onSubmit={async ({ password }) => {
        await onSubmit(password);
      }}
      validationSchema={passwordVerifySchema.fields.password}
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
                  Aucune annulation n&apos;est possible après avoir confirmé la
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

                {error && (
                  <FormInfo color="red">
                    Une erreur est survenue. Vérifiez le mot de passe entré.
                  </FormInfo>
                )}
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
