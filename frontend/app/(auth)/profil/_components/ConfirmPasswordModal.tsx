import React from "react";
import ServerError from "@/app/_components/ServerError";
import type { TRPCClientErrorLike } from "@trpc/react-query";
import { Formik } from "formik";

import type { AppRouter } from "@plan-prise/api";
import { passwordVerifySchema } from "@plan-prise/api/validation/users";
import Form from "@plan-prise/ui/components/forms/Form";
import FormikField from "@plan-prise/ui/components/forms/inputs/FormikField";
import Modal from "@plan-prise/ui/components/overlays/modals/Modal";
import ModalContent from "@plan-prise/ui/components/overlays/modals/ModalContent";
import ModalFooter from "@plan-prise/ui/components/overlays/modals/ModalFooter";
import { Button } from "@plan-prise/ui/shadcn/ui/button";

const ConfirmPasswordModal: React.FC<{
  error?: TRPCClientErrorLike<AppRouter["users"]["passwordVerify"]> | null;
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
                <p className="text-red-500">
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

                {error && <ServerError error={error} />}
              </div>
            </ModalContent>
            <ModalFooter>
              <Button
                loading={isSubmitting}
                type="submit"
                variant="destructive"
              >
                Confirmer
              </Button>
              <Button onClick={onCancel} variant="outline">
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
