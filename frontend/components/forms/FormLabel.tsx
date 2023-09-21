import { styled, tw } from "classname-variants/react";
import React from "react";

const LabelBase: React.FC<
  JSX.IntrinsicElements["select"] & { htmlFor?: string }
> = ({ children, className, htmlFor }) => (
  <label className={className} htmlFor={htmlFor}>
    {children}
  </label>
);

const FormLabel = styled(LabelBase, {
  base: tw`text-xs font-semibold text-gray-700`,
  variants: {},
});

export default FormLabel;
