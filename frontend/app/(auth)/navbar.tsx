"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { default as PlanNavbarStack } from "@/app/(auth)/plan/_components/Navbar/NavbarStack";
import { useNavigationState } from "@/state/navigation";
import type { NavbarIcons, NavigationItem } from "@/types/navigation";
import { trpc } from "@/utils/api";
import { ArrowLeftIcon, HomeIcon, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Logo from "@plan-prise/ui/components/navigation/Logo";
import { Avatar, AvatarFallback } from "@plan-prise/ui/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plan-prise/ui/shadcn/ui/dropdown-menu";

export const navbarIcons: NavbarIcons = {
  arrowLeft: ArrowLeftIcon,
  home: HomeIcon,
};

const NavbarLink: React.FC<NavigationItem> = ({ icon, ...props }) => {
  const NavbarIcon = navbarIcons[icon];

  if ("path" in props) {
    return (
      <Link className="p-2" href={props.path}>
        <NavbarIcon className="h-5 w-5 text-gray-700" />
      </Link>
    );
  } else {
    return null;
  }
};

export const Navbar = () => {
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
        <div data-testid="title">{title}</div>
        {pathname.startsWith("/plan/") && <PlanNavbarStack />}
      </div>
      <div id="navbar-right" className="flex-1 justify-end">
        <div className="ml-auto w-fit">
          <DropdownMenu>
            <DropdownMenuTrigger>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {data?.user?.admin && (
                <>
                  <DropdownMenuLabel>Administration</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                    Utilisateurs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/medics")}
                  >
                    Médicaments
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => router.push("/profil")}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOut({ redirect: false }).finally(() =>
                    router.refresh(),
                  );
                }}
              >
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
