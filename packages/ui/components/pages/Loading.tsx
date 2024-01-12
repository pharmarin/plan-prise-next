import { cn } from "../../shadcn/lib/utils";
import Logo from "../navigation/Logo";

const LoadingScreen: React.FC<{ fullscreen?: boolean; small?: boolean }> = ({
  fullscreen,
  small,
}) => {
  return (
    <div
      className={cn(
        "flex",
        fullscreen
          ? "fixed bottom-0 left-0 right-0 top-0 h-screen w-screen bg-gray-100"
          : "py-40",
      )}
    >
      <div
        className={"m-auto flex max-w-5xl flex-col content-center items-center"}
      >
        <div
          className={cn(
            "m-0 flex flex-row items-center space-x-4 text-5xl text-gray-700",
            { "ml-4": !fullscreen, "text-3xl": small },
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
