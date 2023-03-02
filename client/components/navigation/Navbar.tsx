"use client";

import { trpc } from "@/common/trpc";
import Avatar from "@/components/icons/Avatar";
import Spinner from "@/components/icons/Spinner";
import NavbarLink from "@/components/navigation/NavbarLink";
import { useNavigation } from "@/components/NavigationContextProvider";
import Dropdown from "@/components/overlays/Dropdown";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const { data } = useSession();
  const { title } = useNavigation();
  const { data: user } = trpc.users.current.useQuery();

  const isHome = pathname === "/";

  return (
    <div className="container mx-auto mt-2 mb-4 flex items-center justify-between rounded-lg bg-white p-4 py-2 shadow">
      <div id="navbar-left" className="flex-1">
        <div className="flex w-fit flex-row items-center sm:space-x-8">
          <Link
            className="hidden flex-row overflow-hidden rounded-full font-bold shadow-lg sm:flex"
            href="/"
          >
            <div className="whitespace-nowrap bg-white py-1 pl-2 pr-0.5 text-gray-900">
              Plan de
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pr-2 pl-0.5 text-white">
              prise
            </div>
          </Link>
          {!isHome && <NavbarLink icon="home" path="/" />}
        </div>
      </div>
      <div
        id="navbar-center"
        className="flex w-fit items-center text-xl font-semibold text-teal-900"
      >
        <div>{title}</div>
      </div>
      <div id="navbar-right" className="flex-1 justify-end">
        <div className="ml-auto w-fit">
          <Dropdown
            buttonProps={{
              className:
                "bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mx-3",
            }}
            buttonContent={
              <>
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                {user ? (
                  <Avatar
                    firstName={user.firstName || "P"}
                    lastName={user.lastName || "P"}
                  />
                ) : (
                  <Spinner className="text-gray-800" />
                )}
              </>
            }
            className="z-20"
            items={[
              {
                label: "Profil",
                path: "/profil",
              },
              ...(data?.user?.admin
                ? [
                    {
                      label: "Utilisateurs",
                      path: "/admin/users" as const,
                    },
                  ]
                : []),
              {
                label: "Déconnexion",
                action: () => signOut({ redirect: false }),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
