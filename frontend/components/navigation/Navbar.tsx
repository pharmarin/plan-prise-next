"use client";

import PlanNavbarIndicator from "@/app/(auth)/plan/_components/PlanNavbarIndicator";
import Avatar from "@/components/icons/Avatar";
import Spinner from "@/components/icons/Spinner";
import Logo from "@/components/navigation/Logo";
import NavbarLink from "@/components/navigation/NavbarLink";
import { useNavigation } from "@/components/NavigationContextProvider";
import Dropdown from "@/components/overlays/Dropdown";
import { trpc } from "@/trpc/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const { returnTo, title } = useNavigation();
  const { data: user } = trpc.users.current.useQuery();

  const isHome = pathname === "/";

  // Redirect user to profil page if incomplete informations after migration
  if (pathname !== "/profil" && user && (!user?.firstName || !user?.lastName)) {
    router.push("/profil");
  }

  return (
    <div className="container mx-auto mb-4 mt-2 flex items-center justify-between rounded-lg bg-white p-4 py-2 shadow">
      <div id="navbar-left" className="flex-1">
        <div className="flex w-fit flex-row items-center sm:space-x-8">
          <Link href="/">
            <Logo />
          </Link>
          {!isHome && <NavbarLink icon="home" path="/" />}
          {returnTo && <NavbarLink icon="arrowLeft" path={returnTo} />}
        </div>
      </div>
      <div
        id="navbar-center"
        className="flex w-fit items-center justify-center space-x-2 text-xl font-semibold text-teal-900"
      >
        <div>{title}</div>
        {pathname.startsWith("/plan/") && <PlanNavbarIndicator />}
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
                action: async () => {
                  await signOut({ redirect: false });
                  router.refresh();
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
