import CheckboxInput from "components/forms/inputs/CheckboxInput";
import FileInput from "components/forms/inputs/FileInput";
import TextInput from "components/forms/inputs/TextInput";
import { FieldAttributes, useField, useFormikContext } from "formik";
import React from "react";

const FormikField: React.FC<
  FieldAttributes<React.HTMLProps<HTMLInputElement>> & {
    children?: never;
    displayErrors?: boolean;
    disableOnSubmit?: boolean;
    ref?: React.Ref<HTMLInputElement>;
  } & (
      | ({ type: "checkbox" } & typeof CheckboxInput.defaultProps)
      | ({ type: "file" } & typeof FileInput.defaultProps)
      | ({
          type?: "email" | "password" | "text";
        } & typeof TextInput.defaultProps)
    )
> = ({ disabled, disableOnSubmit, displayErrors, label, ...props }) => {
  const [field, meta] = useField(props);
  const { isSubmitting, setFieldTouched, setFieldValue } = useFormikContext();

  const inputProps = {
    ...field,
    ...props,
    disabled: (disableOnSubmit && isSubmitting) || disabled,
    label,
  };

  return (
    <div>
      {(() => {
        switch (props.type) {
          case "checkbox":
            return <CheckboxInput {...inputProps} />;
          case "file":
            return (
              <FileInput
                {...inputProps}
                onChange={(event) => {
                  setFieldValue(props.name, event.currentTarget.files?.[0]);
                  setFieldTouched(
                    props.name,
                    (event.currentTarget.files || []).length > 0
                  );
                }}
              />
            );
          default:
            return <TextInput {...inputProps} type={props.type || "text"} />;
        }
      })()}
      {displayErrors && meta.touched && meta.error && (
        <div className="mt-1 text-xs text-red-600">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikField;
