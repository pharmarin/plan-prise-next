import { styled, tw } from "classname-variants/react";
import Spinner from "components/icons/Spinner";
import React from "react";

const ButtonBase: React.FC<
  JSX.IntrinsicElements["button"] & {
    loading?: boolean;
  }
> = ({ children, className, disabled, loading, type = "button", ...props }) => {
  return (
    <button
      className={className}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && <Spinner className="-ml-1 mr-2" />}
      <span className="truncate">{children}</span>
    </button>
  );
};

const Button = styled(ButtonBase, {
  base: tw`inline-flex justify-center rounded-md border border-transparent text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm text-white items-center disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-teal-500 transition-colors min-w-0`,
  variants: {
    color: {
      white: tw`border-gray-300 bg-white text-gray-700 hover:bg-gray-50`,
      primary: tw`bg-teal-500 hover:bg-teal-600 focus:ring-teal-600`,
      red: tw`bg-red-600 hover:bg-red-700 focus:ring-red-500`,
      gradient: tw`bg-gradient-to-r from-emerald-500 to-teal-500 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-slate-500`,
      link: tw`bg-transparent p-0 font-normal text-teal-500 shadow-none`,
    },
    size: {
      sm: tw`px-2 py-1`,
      md: tw`px-4 py-2`,
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

export default Button;
