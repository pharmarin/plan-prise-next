"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/app/routes-schema";
import type { NavigationItem } from "@/app/state-navigation";
import { navbarIcons, useNavigationState } from "@/app/state-navigation";
import type { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback } from "@plan-prise/ui/avatar";
import Logo from "@plan-prise/ui/components/navigation/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plan-prise/ui/dropdown-menu";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@plan-prise/ui/tooltip";

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

export const Navbar = ({
  user,
}: {
  user: Pick<User, "lastName" | "firstName">;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const title = useNavigationState((state) => state.title);
  const returnTo = useNavigationState((state) => state.returnTo);
  const options = useNavigationState((state) => state.options);

  const isHome = pathname === routes.home();

  // Redirect user to profil page if incomplete informations after migration
  if (
    (pathname as unknown) !== routes.profil() &&
    user &&
    (!user?.firstName || !user?.lastName)
  ) {
    router.push(routes.profil());
  }

  return (
    <div className="container mx-auto mb-4 mt-2 flex items-center justify-between rounded-lg bg-white p-4 py-2 shadow">
      <div id="navbar-left" className="flex-1">
        <div className="flex w-fit flex-row items-center sm:space-x-8">
          <Link href={routes.home()}>
            <Logo />
          </Link>
          {!isHome && <NavbarLink icon="home" path={routes.home()} />}
          {returnTo && <NavbarLink icon="arrowLeft" path={returnTo} />}
        </div>
      </div>
      <div
        id="navbar-center"
        className="flex w-fit items-center justify-center space-x-2 text-xl font-semibold text-teal-900"
      >
        <div data-testid="navbar-title">{title}</div>
        {options?.map((option, index) => {
          const NavbarIcon = navbarIcons[option.icon];

          const Button = (
            <button
              key={index}
              className={cn(
                ("path" in option && option.path.length > 0) ||
                  ("event" in option && option.event.length > 0)
                  ? "cursor-pointer"
                  : "cursor-not-allowed",
                option.disabled && "cursor-not-allowed",
                option.className,
              )}
              onClick={() => {
                if (option.disabled) return;
                if ("path" in option) router.push(option.path);
                if ("event" in option && option.event.length > 0)
                  document.dispatchEvent(new Event(option.event));
              }}
            >
              <NavbarIcon className="h-4 w-4" />
            </button>
          );

          if (option.tooltip) {
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>{Button}</TooltipTrigger>
                  <TooltipContent>{option.tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return Button;
        })}
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
                  <DropdownMenuItem
                    onClick={() => router.push(routes.adminDashboard())}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(routes.users())}>
                    Utilisateurs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(routes.medicaments())}
                  >
                    Médicaments
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(routes.principesActifs())}
                  >
                    Principes Actifs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => router.push(routes.profil())}>
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
