import { FieldAttributes, useField, useFormikContext } from "formik";
import React from "react";

const FormikField: React.FC<
  FieldAttributes<React.HTMLProps<HTMLInputElement>> &
    React.PropsWithChildren<{
      displayErrors?: boolean;
      disableOnSubmit?: boolean;
    }>
> = ({
  children,
  disabled,
  disableOnSubmit,
  displayErrors,
  label,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const { isSubmitting, setFieldValue } = useFormikContext();

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...field,
            ...props,
            ...(props.type === "file" && {
              onChange: (event) =>
                setFieldValue(props.name, event.currentTarget.files?.[0]),
            }),
            disabled: (disableOnSubmit && isSubmitting) || disabled,
            label,
          } as React.HTMLProps<HTMLInputElement>);
        }

        return child;
      })}
      {displayErrors && meta.touched && meta.error && (
        <div className="mt-1 text-xs text-red-600">{meta.error}</div>
      )}
    </>
  );
};

export default FormikField;
