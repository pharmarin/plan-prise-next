import FormLabel from "components/forms/FormLabel";
import React from "react";
import { twMerge } from "tailwind-merge";

const FileInput: React.FC<
  JSX.IntrinsicElements["input"] & { label?: string; value?: File }
> = ({ className, label, value, ...props }) => {
  return (
    <div className="mb-4">
      {label && <FormLabel name={props.name}>{label}</FormLabel>}
      <div className="relative">
        <input
          className={twMerge(
            "relative z-10 m-0 h-10 w-full opacity-0",
            className
          )}
          type="file"
          {...props}
        />
        <div className="absolute left-0 right-0 top-0 flex hover:cursor-pointer">
          <label className="bg-white-900 inline-block h-9 w-full flex-grow rounded-l-md border border-l-0 border-gray-300 p-2 text-sm text-gray-500">
            {value ? value.name : props.placeholder}
          </label>
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
            {value ? "Modifier" : "Ajouter"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
