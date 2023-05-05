import { twMerge } from "tailwind-merge";

const TableHeadCell: React.FC<React.ComponentPropsWithoutRef<"th">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th
      className={twMerge(
        "sticky top-0 border-b border-gray-300 bg-gray-200 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 first:rounded-tl-lg last:rounded-tr-lg",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

export default TableHeadCell;
