const TableBody: React.FC<React.ComponentPropsWithoutRef<"tbody">> = ({
  children,
  ...props
}) => {
  return <tbody {...props}>{children}</tbody>;
};

export default TableBody;
