import DeleteButton from "@/app/(auth)/plan/_components/Navbar/DeleteButton";
import NavbarIndicator from "@/app/(auth)/plan/_components/Navbar/LoadingIndicator";
import Settings from "@/app/(auth)/plan/_components/Navbar/Settings";

const NavbarStack = () => {
  return (
    <div className="flex items-center space-x-2">
      <NavbarIndicator />
      <DeleteButton />
      <Settings />
    </div>
  );
};

export default NavbarStack;
