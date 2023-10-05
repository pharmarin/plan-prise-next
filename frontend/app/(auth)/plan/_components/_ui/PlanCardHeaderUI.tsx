import type { ReactNode } from "react";

const PlanCardHeaderUI = ({
  children,
  buttons,
}: {
  children: ReactNode;
  buttons?: ReactNode;
}) => {
  return (
    <div className="flex bg-gray-100 p-4 pb-2">
      <div className="relative flex flex-grow flex-col">{children}</div>
      <div className="flex flex-shrink-0 flex-grow-0 flex-col space-y-1">
        {buttons}
      </div>
    </div>
  );
};

export default PlanCardHeaderUI;
