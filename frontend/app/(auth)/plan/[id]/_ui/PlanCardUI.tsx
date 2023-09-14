const PlanCardUI = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg shadow-md">
      {children}
    </div>
  );
};

export default PlanCardUI;
