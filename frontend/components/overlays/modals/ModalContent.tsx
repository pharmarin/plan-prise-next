import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import React, { type PropsWithChildren } from "react";

const ModalContent: React.FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <div className="mb-4 bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <Avatar className="mb-4">
          <AvatarFallback className="bg-red-100">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-red-500"
              aria-hidden="true"
            />
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
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
