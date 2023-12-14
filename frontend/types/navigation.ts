import type { LucideIcon } from "lucide-react";

export type NavbarIcons = {
  arrowLeft: LucideIcon;
  home: LucideIcon;
};

export type NavigationItem = {
  icon: keyof NavbarIcons;
  className?: string;
} & ({ path: string | URL } | { event: string });
