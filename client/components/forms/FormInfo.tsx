import React from "react";
import { twMerge } from "tailwind-merge";

const FormInfo: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div className={twMerge("mt-1 text-xs text-gray-500", className)}>
    {children}
  </div>
);

export default FormInfo;
