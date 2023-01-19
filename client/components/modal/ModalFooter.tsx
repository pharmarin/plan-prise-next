import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const ModalFooter: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div
    className={twMerge(
      "rounded-b-lg bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6",
      className
    )}
  >
    {children}
  </div>
);

export default ModalFooter;
