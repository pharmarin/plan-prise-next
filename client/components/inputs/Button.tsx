import Spinner from "components/icons/Spinner";
import React from "react";
import { twMerge } from "tailwind-merge";

const Button: React.FC<
  JSX.IntrinsicElements["button"] & { gradient?: boolean; loading?: boolean }
> = ({ children, className, disabled, gradient, loading, ...props }) => {
  return (
    <button
      className={twMerge(
        "flex flex-row space-x-2 rounded-full py-2 px-4 font-bold text-white disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-slate-500",
        gradient && "bg-gradient-to-r from-emerald-500 to-teal-500",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="-ml-1 mr-3" />}
      {children}
    </button>
  );
};

export default Button;
