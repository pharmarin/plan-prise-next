import { twMerge } from "tailwind-merge";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={twMerge(
        "hidden flex-row overflow-hidden rounded-full font-bold shadow-lg sm:flex",
        className,
      )}
    >
      <div className="whitespace-nowrap bg-white py-1 pl-2 pr-0.5 text-gray-900">
        Plan de
      </div>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pl-0.5 pr-2 text-white">
        prise
      </div>
    </div>
  );
};

export default Logo;
