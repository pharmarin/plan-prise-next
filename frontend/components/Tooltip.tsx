import type { ReactNode } from "react";

const Tooltip = ({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}) => {
  return (
    <div className="group relative flex">
      {children}
      <span className="absolute left-1/2 top-7 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-gray-800 p-2 text-center text-xs text-white transition-all group-hover:scale-100">
        {message}
      </span>
    </div>
  );
};

export default Tooltip;
