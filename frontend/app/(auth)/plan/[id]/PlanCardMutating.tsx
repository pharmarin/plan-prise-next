"use client";

import Logo from "@/components/navigation/Logo";

const PlanCardMutating = ({
  denomination,
  type,
}: {
  denomination: string;
  type: "adding";
}) => {
  return (
    <div className="flex h-16 justify-center overflow-hidden rounded-lg shadow-md">
      <div className="flex flex-row items-center space-x-4">
        <Logo className="animate-pulse text-base" />
        <span className="text-gray-700">
          {type === "adding" && `Ajout de ${denomination} en cours...`}
        </span>
        {/* <PlanCardHeader
          medicament={medicament}
          open={showDetails}
          toggle={() => setShowDetails((showDetails) => !showDetails)}
        /> */}
      </div>
    </div>
  );
};
export default PlanCardMutating;
