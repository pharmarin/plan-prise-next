import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const Card: React.FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge("rounded-lg bg-white p-4 shadow-md", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
