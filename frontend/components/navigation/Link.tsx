import NextLink, { type LinkProps } from "next/link";
import { twMerge } from "tailwind-merge";

<NextLink href={`/plan/${1}`} />;

const Link = <RouteType extends string>({
  className,
  ...props
}: LinkProps<RouteType>) => (
  <NextLink className={twMerge("text-teal-500", className)} {...props} />
);

export default Link;
