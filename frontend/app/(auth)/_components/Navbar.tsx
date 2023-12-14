"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavbarLink from "@/app/(auth)/_components/NavbarLink";
import { useNavigationState } from "@/state/navigation";
import { trpc } from "@/utils/api";
import { default as PlanNavbarStack } from "app/(auth)/plan/_components/Navbar/NavbarStack";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Logo from "@plan-prise/ui/components/navigation/Logo";
import Dropdown from "@plan-prise/ui/components/overlays/Dropdown";
import { Avatar, AvatarFallback } from "@plan-prise/ui/shadcn/ui/avatar";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const title = useNavigationState((state) => state.title);
  const returnTo = useNavigationState((state) => state.returnTo);
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
        {pathname.startsWith("/plan/") && <PlanNavbarStack />}
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
                  <Avatar>
                    <AvatarFallback className="bg-teal-500 text-white">
                      {user.firstName?.[0] ?? "P"}
                      {user.lastName?.[0] ?? "P"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarFallback>
                      <Loader2 className="animate-spin text-gray-800" />
                    </AvatarFallback>
                  </Avatar>
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
                  await signOut({ redirect: false }).finally(() =>
                    router.refresh(),
                  );
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
