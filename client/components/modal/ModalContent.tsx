import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const ModalContent: React.FC<
  PropsWithChildren<{ className?: string; icon?: React.ReactNode }>
> = ({ children, className, icon }) => {
  return (
    <div className="p-4 sm:px-6 sm:py-4">
      <div className="sm:flex sm:items-start">
        {icon && (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            {icon}
          </div>
        )}
        <div
          className={twMerge(
            "mt-3 w-full text-center sm:mx-4 sm:mt-0 sm:text-left",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
