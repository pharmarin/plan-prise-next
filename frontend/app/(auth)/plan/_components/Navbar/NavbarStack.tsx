import DeleteButton from "@/app/(auth)/plan/_components/Navbar/DeleteButton";
import NavbarIndicator from "@/app/(auth)/plan/_components/Navbar/LoadingIndicator";
import PrintButton from "@/app/(auth)/plan/_components/Navbar/PrintButton";
import SettingsButton from "@/app/(auth)/plan/_components/Navbar/SettingsButton";

const NavbarStack = () => {
  return (
    <div className="flex items-center space-x-2">
      <NavbarIndicator />
      <DeleteButton />
      <SettingsButton />
      <PrintButton />
    </div>
  );
};

export default NavbarStack;
