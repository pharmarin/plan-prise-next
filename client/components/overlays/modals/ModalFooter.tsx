import React, { PropsWithChildren } from "react";

const ModalFooter: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col space-y-2 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:space-y-0 sm:space-x-4 sm:space-x-reverse sm:px-6">
      {children}
    </div>
  );
};

export default ModalFooter;
