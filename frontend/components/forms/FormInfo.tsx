import { styled, tw } from "classname-variants/react";
import React from "react";
import { twMerge } from "tailwind-merge";

const FormInfoBase: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className, ...props }) => (
  <div className={twMerge(className)} {...props}>
    {children}
  </div>
);

const FormInfo = styled(FormInfoBase, {
  base: tw`mt-1 text-xs`,
  variants: {
    color: {
      gray: tw`text-gray-500`,
      green: tw`text-teal-500`,
      red: tw`text-red-500`,
    },
  },
  defaultVariants: { color: "gray" },
});

export default FormInfo;
