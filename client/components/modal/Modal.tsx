import { Dialog, Transition } from "@headlessui/react";
import React, { PropsWithChildren } from "react";

const Modal: React.FC<
  PropsWithChildren<{
    show: boolean;
    toggle?: () => void;
  }>
> = ({ children, show, toggle = () => undefined }) => {
  return (
    <Transition appear as={React.Fragment} show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={toggle}
        open={show}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-600 opacity-50" />
          </Transition.Child>

          <span // Permet de centrer les éléments dans le modal
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            className="inline-block transform rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
            role="dialog"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
