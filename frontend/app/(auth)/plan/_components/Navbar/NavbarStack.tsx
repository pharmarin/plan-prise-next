import DeleteButton from "@/app/(auth)/plan/_components/Navbar/DeleteButton";
import LoadingIndicator from "@/app/(auth)/plan/_components/Navbar/LoadingIndicator";
import PrintButton from "@/app/(auth)/plan/_components/Navbar/PrintButton";
import SettingsButton from "@/app/(auth)/plan/_components/Navbar/SettingsButton";
import usePlanStore from "@/app/(auth)/plan/_lib/state";

const NavbarStack = () => {
  const medics = usePlanStore((state) => state.medics);

  if (!medics || medics.length === 0) {
    return undefined;
  }

  return (
    <div className="flex items-center space-x-2">
      <LoadingIndicator />
      <DeleteButton />
      <SettingsButton />
      <PrintButton />
    </div>
  );
};

export default NavbarStack;
