import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line react/display-name
const TextInput = forwardRef<
  HTMLInputElement,
  Omit<
    JSX.IntrinsicElements["input"] & {
      wrapperClassName?: string;
      label?: string;
    },
    "ref"
  >
>(({ className, id, label, wrapperClassName, ...props }, ref) => {
  return (
    <div className={twMerge("relative", wrapperClassName)}>
      <input
        type="text"
        id={id}
        className={twMerge(
          "peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-700 focus:border-emerald-600 focus:outline-none focus:ring-0",
          className
        )}
        placeholder=" "
        {...props}
        ref={ref}
      />
      {label && (
        <label
          htmlFor={id}
          className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-emerald-600"
        >
          {label}
        </label>
      )}
    </div>
  );
});

export default TextInput;
