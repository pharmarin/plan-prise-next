import RoundedIcon from "@/components/icons/RoundedIcon";
import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import React, { type PropsWithChildren } from "react";

const ModalContent: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div className="mb-4 bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <RoundedIcon className="mb-4" color="red">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </RoundedIcon>
        <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
          {title && (
            <Dialog.Title
              as="h3"
              className="mb-2 text-lg font-medium leading-6 text-gray-900"
            >
              {title}
            </Dialog.Title>
          )}
          <div className="text-sm text-gray-500">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
