import { Dialog } from "@headlessui/react";
import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const ModalTitle: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <Dialog.Title
      as="h3"
      className={twMerge(
        "mb-2 px-10 pt-8 text-lg font-medium leading-6 text-teal-900",
        className
      )}
    >
      {children}
    </Dialog.Title>
  );
};

export default ModalTitle;
