import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

const FormSubmitSuccess: React.FC<{
  title: string;
  content: React.ReactNode;
}> = ({ title, content }) => {
  return (
    <div className={twMerge("space-y-2 text-gray-900")}>
      <h4 className="mt-2 flex items-center font-medium">
        <CheckBadgeIcon className="mr-1 h-4 w-4 flex-none text-teal-500" />
        <span>{title}</span>
      </h4>
      {content}
    </div>
  );
};
export default FormSubmitSuccess;
