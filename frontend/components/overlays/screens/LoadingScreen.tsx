import Logo from "@/components/navigation/Logo";
import { twMerge } from "tailwind-merge";

const LoadingScreen: React.FC<{ fullscreen?: boolean }> = ({ fullscreen }) => {
  return (
    <div
      className={twMerge(
        "flex",
        fullscreen
          ? "fixed bottom-0 left-0 right-0 top-0 h-screen w-screen bg-gray-100"
          : "py-40",
      )}
    >
      <div className="m-auto flex max-w-5xl flex-col content-center items-center">
        <div
          className={twMerge(
            "m-0 flex flex-row items-center space-x-4 text-5xl text-gray-700",
            !fullscreen && "ml-4",
          )}
        >
          <Logo className="animate-pulse text-lg" />
          <span className="hidden pr-4 font-light xl:block">
            Chargement en cours...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
