import type { ReactNode } from "react";
import NextLink from "next/link";
import { twMerge } from "tailwind-merge";

const Link = ({
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) => <NextLink className={twMerge("text-teal-500", className)} {...props} />;

export default Link;
