const TableHead: React.FC<React.ComponentPropsWithoutRef<"thead">> = ({
  children,
  ...props
}) => {
  return <thead {...props}>{children}</thead>;
};

export default TableHead;
