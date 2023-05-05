import { twMerge } from "tailwind-merge";

const Table: React.FC<React.ComponentPropsWithoutRef<"table">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <table
      className={twMerge(
        "whitespace-no-wrap relative w-full table-auto border-collapse overflow-y-auto rounded-lg bg-white shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </table>
  );
};

export default Table;
