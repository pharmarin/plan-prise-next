import { styled, tw } from "classname-variants/react";
import React from "react";

const FormInfoBase: React.FC<React.PropsWithChildren> = ({
  children,
  ...props
}) => <div {...props}>{children}</div>;

const FormInfo = styled("div", {
  base: tw`mt-1 text-xs`,
  variants: {
    color: {
      gray: tw`text-gray-500`,
      red: tw`text-red-500`,
    },
  },
  defaultVariants: { color: "gray" },
});

export default FormInfo;
