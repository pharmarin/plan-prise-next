import PlanDeleteButton from "@/app/(auth)/plan/_components/Navbar/PlanDeleteButton";
import PlanNavbarIndicator from "@/app/(auth)/plan/_components/Navbar/PlanNavbarIndicator";

const PlanNavbarStack = () => {
  return (
    <div className="flex items-center space-x-2">
      <PlanNavbarIndicator />
      <PlanDeleteButton />
    </div>
  );
};

export default PlanNavbarStack;
