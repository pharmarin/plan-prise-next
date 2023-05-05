import { twMerge } from "tailwind-merge";

const TableFooter: React.FC<React.ComponentPropsWithoutRef<"tfoot">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tfoot className={twMerge("border-t border-solid", className)} {...props}>
      {children}
    </tfoot>
  );
};

export default TableFooter;
