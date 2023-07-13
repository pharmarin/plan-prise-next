import FormLabel from "@/components/forms/FormLabel";
import { styled, tw } from "classname-variants/react";
import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const SelectBase: React.FC<
  PropsWithChildren<
    Omit<
      JSX.IntrinsicElements["select"] & {
        label?: string;
        wrapperClassName?: string;
      },
      "size"
    >
  >
> = ({ children, label, wrapperClassName, ...props }) => {
  return (
    <div className={twMerge("relative", wrapperClassName)}>
      {label && <FormLabel name={props.id}>{label}</FormLabel>}
      <select {...props}>{children}</select>
    </div>
  );
};

const Select = styled(SelectBase, {
  base: tw`rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-teal-500 transition-colors min-w-0`,
  variants: {
    size: { sm: tw`pl-2 pr-6 py-[.125rem]`, md: tw`pl-4 pr-8 py-2` },
  },
  defaultVariants: { size: "md" },
});

export default Select;
