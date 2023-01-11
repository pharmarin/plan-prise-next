import { twMerge } from "tailwind-merge";

const TableRow: React.FC<
  React.ComponentPropsWithoutRef<"tr"> & { hover?: boolean }
> = ({ children, className, hover, ...props }) => {
  return (
    <tr className={twMerge(hover && "hover:bg-gray-100", className)} {...props}>
      {children}
    </tr>
  );
};

export default TableRow;
