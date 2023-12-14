import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const CheckboxInput = forwardRef<
  HTMLInputElement,
  Omit<
    JSX.IntrinsicElements["input"] & {
      label?: string;
      wrapperClassName?: string;
    },
    "ref"
  >
>(({ className, label, wrapperClassName, ...props }, ref) => {
  return (
    <div className={twMerge("flex items-start", wrapperClassName)}>
      <div className="flex h-5 items-center">
        <input
          type="checkbox"
          className={twMerge(
            "focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 checked:bg-teal-600 checked:hover:bg-teal-700 focus:ring-emerald-300",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
      {label && (
        <label
          htmlFor={props.id}
          className="ml-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
    </div>
  );
});

export default CheckboxInput;
