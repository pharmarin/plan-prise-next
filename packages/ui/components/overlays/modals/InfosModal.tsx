import React from "react";

import Modal from "./Modal";
import ModalContent from "./ModalContent";
import ModalFooter from "./ModalFooter";

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