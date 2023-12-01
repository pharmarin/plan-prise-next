import { twMerge } from "tailwind-merge";

const TableRow: React.FC<
  React.ComponentPropsWithoutRef<"tr"> & { hover?: boolean; stripped?: boolean }
> = ({ children, className, hover, stripped, ...props }) => {
  return (
    <tr
      className={twMerge(
        hover && "hover:bg-gray-100",
        stripped && "odd:bg-white even:bg-slate-50",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export default TableRow;
