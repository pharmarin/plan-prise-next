import type { LinkProps } from "next/link";
import NextLink from "next/link";
import { twMerge } from "tailwind-merge";

const Link = <RouteType extends string>({
  className,
  ...props
}: LinkProps<RouteType>) => (
  <NextLink className={twMerge("text-teal-500", className)} {...props} />
);

export default Link;
