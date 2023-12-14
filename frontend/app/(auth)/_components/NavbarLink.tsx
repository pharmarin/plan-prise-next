import React from "react";
import Link from "next/link";
import type { NavbarIcons, NavigationItem } from "@/types/navigation";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";

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

export default NavbarLink;
