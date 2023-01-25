import Modal from "components/overlays/modals/Modal";
import ModalContent from "components/overlays/modals/ModalContent";
import ModalFooter from "components/overlays/modals/ModalFooter";
import React from "react";

const InfosModal: React.FC<{
  content?: React.ReactNode; // <p> or <><p><p></>
  footer?: React.ReactNode;
  show: boolean;
  title?: string;
  toggle?: () => void;
}> = ({ content, footer, show, title, toggle = () => undefined }) => {
  return (
    <Modal show={show} toggle={toggle}>
      <ModalContent title={title}>{content}</ModalContent>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};

export default InfosModal;
