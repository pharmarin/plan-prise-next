import FormInfo from "@/components/forms/FormInfo";
import FormLabel from "@/components/forms/FormLabel";
import ReactTextareaAutosize from "react-textarea-autosize";
import { twMerge } from "tailwind-merge";

const TextAreaInput = ({
  className,
  info,
  label,
  slideLabel,
  wrapperClassName,
  ...props
}: Omit<
  JSX.IntrinsicElements["textarea"] & {
    info?: string;
    label?: string;
    slideLabel?: boolean;
    wrapperClassName?: string;
  },
  "style" | "ref"
>) => {
  return (
    <div className={twMerge("relative w-full", wrapperClassName)}>
      {!slideLabel && label && (
        <FormLabel htmlFor={props.id}>{label}</FormLabel>
      )}
      <ReactTextareaAutosize
        className={twMerge(
          "peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-700 focus:border-emerald-600 focus:outline-none focus:ring-0",
          slideLabel && "px-2 pb-2 pt-4",
          className,
        )}
        {...props}
      />
      {slideLabel && label && (
        <label
          htmlFor={props.id}
          className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:cursor-text peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-emerald-600"
        >
          {label}
        </label>
      )}
      {info && <FormInfo>{info}</FormInfo>}
    </div>
  );
};

export default TextAreaInput;
