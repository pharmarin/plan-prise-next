import { styled, tw } from "classname-variants/react";
import NextLink from "next/link";

const Link = styled(NextLink, {
  base: tw`text-teal-500`,
  variants: {},
});

export default Link;
