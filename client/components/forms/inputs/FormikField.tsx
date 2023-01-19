import { Field, FieldAttributes, FieldProps } from "formik";
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
  name,
  ...formikProps
}) => {
  return (
    <Field name={name} {...formikProps}>
      {({ field, form, meta }: FieldProps) => (
        <>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...field,
                disabled: (disableOnSubmit && form.isSubmitting) || disabled,
                label,
              } as React.HTMLProps<HTMLInputElement>);
            }

            return child;
          })}
          {displayErrors && meta.touched && meta.error && (
            <div className="mt-1 text-xs text-red-600">{meta.error}</div>
          )}
        </>
      )}
    </Field>
  );
};

export default FormikField;
