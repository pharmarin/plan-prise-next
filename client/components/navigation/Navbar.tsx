import Dropdown from "components/Dropdown";
import Avatar from "components/icons/Avatar";
import NavbarLink from "components/navigation/NavbarLink";
import { logoutUserAction } from "lib/redux/auth/actions";
import { selectUserData } from "lib/redux/auth/selectors";
import { selectTitle } from "lib/redux/navigation/selectors";
import { useDispatch } from "lib/redux/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const user = useSelector(selectUserData);
  const navTitle = useSelector(selectTitle);
  const isHome = pathname === "/";

  return (
    <div className="py-2">
      <div className="container mx-auto flex justify-between rounded-lg bg-white p-4">
        <div id="navbar-left" className="flex-1">
          <div className="flex w-fit flex-row items-center space-x-8">
            <Link
              className="flex flex-row overflow-hidden rounded-full font-bold shadow-lg"
              href="/"
            >
              <div className="bg-white py-1 pl-2 pr-0.5 text-gray-900">
                Plan de
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pr-2 pl-0.5 text-white">
                prise
              </div>
            </Link>
            {!isHome && <NavbarLink icon="home" path="/" />}
          </div>
        </div>
        <div id="navbar-center" className="w-fit text-xl font-semibold">
          {navTitle}
        </div>
        <div id="navbar-right" className="flex-1 justify-end">
          <div className="ml-auto w-fit">
            <Dropdown
              buttonProps={{
                className:
                  "bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mx-3",
              }}
              buttonContent={
                <>
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <Avatar
                    firstName={user?.attributes?.firstName || "P"}
                    lastName={user?.attributes?.lastName || "P"}
                  />
                </>
              }
              items={[
                {
                  label: "Profil",
                  path: "/profil",
                },
                ...(user?.attributes?.admin
                  ? [
                      {
                        label: "Utilisateurs",
                        path: "/admin/users",
                      },
                    ]
                  : []),
                {
                  label: "Déconnexion",
                  action: () => dispatch(logoutUserAction()),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
