import React from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md"
      data-testid="plan-card"
    >
      {children}
    </div>
  );
};

export default Card;
