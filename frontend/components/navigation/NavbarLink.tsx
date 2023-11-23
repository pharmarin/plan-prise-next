import React from "react";
import Link from "next/link";
import type { NavigationItem } from "@/types/navigation";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/20/solid";

export const navbarIcons = {
  arrowLeft: ArrowLeftIcon,
  home: HomeIcon,
} as const;

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

export default NavbarLink;
