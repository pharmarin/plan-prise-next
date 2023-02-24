import React from "react";
import { NavigationItem } from "types";

const NavbarLink: React.FC<NavigationItem> = ({ icon, ...props }) => {
  //const NavbarIcon = navbarIcons[icon];

  if ("path" in props) {
    return null /* (
      <Link className="p-2" href={props.path}>
        <NavbarIcon className="h-5 w-5 text-gray-700" />
      </Link>
    ) */;
  } else {
    return null;
  }
};

export default NavbarLink;
