import React from "react";
import { Form as FormikForm } from "formik";
import { twMerge } from "tailwind-merge";

const Form: React.FC<
  React.ComponentPropsWithoutRef<"form"> & {
    withFormik?: boolean;
  }
> = ({ children, className, withFormik, ...props }) => {
  const FORM_CLASSNAME = "space-y-4";

  if (withFormik) {
    return (
      <FormikForm className={twMerge(FORM_CLASSNAME, className)} {...props}>
        {children}
      </FormikForm>
    );
  }
  return (
    <form className={twMerge(FORM_CLASSNAME, className)} {...props}>
      {children}
    </form>
  );
};

export default Form;
