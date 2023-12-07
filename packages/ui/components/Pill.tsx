import React from "react";
import { twMerge } from "tailwind-merge";

const Pill: React.FC<React.ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        "flex justify-center rounded-full bg-teal-500 bg-opacity-90 p-1 align-middle text-xs text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Pill;
