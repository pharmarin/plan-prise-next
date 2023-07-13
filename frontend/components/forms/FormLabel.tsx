import React from "react";

const FormLabel: React.FC<React.PropsWithChildren<{ name?: string }>> = ({
  children,
  name,
}) => (
  <label className="text-xs font-semibold text-gray-700" htmlFor={name}>
    {children}
  </label>
);

export default FormLabel;
