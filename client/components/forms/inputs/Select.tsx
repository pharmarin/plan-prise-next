import { styled, tw } from "classname-variants/react";
import { PropsWithChildren } from "react";

const SelectBase: React.FC<
  PropsWithChildren<Omit<JSX.IntrinsicElements["select"], "size">>
> = ({ children, ...props }) => <select {...props}>{children}</select>;

const Select = styled(SelectBase, {
  base: tw`rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-teal-500 transition-colors min-w-0`,
  variants: {
    size: { sm: tw`pl-2 pr-6 py-[.125rem]`, md: tw`pl-4 pr-8 py-2` },
  },
  defaultVariants: { size: "md" },
});

export default Select;
