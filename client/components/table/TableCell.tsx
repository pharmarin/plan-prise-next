import Link from "next/link";
import { twMerge } from "tailwind-merge";

const TableCell: React.FC<
  React.ComponentPropsWithoutRef<"td"> & { link?: string }
> = ({ children, className, link, ...props }) => {
  return (
    <td
      className={twMerge(
        "border-t border-dashed border-gray-200 text-gray-700",
        !link && "px-6 py-3",
        className
      )}
      {...props}
    >
      {link ? (
        <Link
          href={link}
          className={"flex justify-center px-6 py-3 text-gray-700"}
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </td>
  );
};

export default TableCell;
