import { styled, tw } from "classname-variants/react";
import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const RoundedIconBase: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={twMerge(className)} {...props}>
      {children}
    </div>
  );
};

const RoundedIcon = styled(RoundedIconBase, {
  base: tw`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10`,
  variants: {
    color: {
      primary: tw`bg-teal-500`,
      red: tw`bg-red-100`,
    },
  },
  defaultVariants: { color: "primary" },
});

export default RoundedIcon;
