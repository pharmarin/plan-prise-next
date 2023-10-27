import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line react/display-name
const TextInput = forwardRef<
  HTMLInputElement,
  Omit<
    JSX.IntrinsicElements["input"] & {
      info?: string;
      label?: string;
      slideLabel?: boolean;
      type?: "email" | "text" | "password" | "search";
      wrapperClassName?: string;
    },
    "ref"
  >
>(
  (
    {
      className,
      info,
      label,
      slideLabel,
      type = "text",
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={twMerge("relative w-full", wrapperClassName)}>
        {!slideLabel && label && <Label htmlFor={props.id}>{label}</Label>}
        <input
          className={twMerge(
            "peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-700 focus:border-emerald-600 focus:outline-none focus:ring-0",
            slideLabel && "px-2 pb-2 pt-3",
            className,
          )}
          type={type}
          {...props}
          ref={ref}
        />
        {slideLabel && label && (
          <label
            htmlFor={props.id}
            className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:cursor-text peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-emerald-600"
          >
            {label}
          </label>
        )}
        {info && <p className="mt-1 text-xs text-muted-foreground">{info}</p>}
      </div>
    );
  },
);

export default TextInput;
