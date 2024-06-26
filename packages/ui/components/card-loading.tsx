import Card from "./card";
import CardHeader from "./card-header";
import Logo from "./navigation/Logo";

const CardLoading = (
  props:
    | {
        denomination: string;
        type: "adding" | "deleting";
      }
    | { type: "fetching" },
) => {
  return (
    <Card>
      <CardHeader>
        <div className="absolute inset-0 z-10 flex flex-row items-center justify-center space-x-4 font-bold">
          <Logo className="animate-pulse text-base" />
          <span className="text-gray-700">
            {props.type === "adding" &&
              `Ajout de ${props.denomination} en cours...`}
            {props.type === "deleting" &&
              `Suppression de ${props.denomination} en cours...`}
            {props.type === "fetching" && "Chargement en cours..."}
          </span>
        </div>
        <div className="flex h-24 flex-grow flex-col">
          <span className="mb-2 h-6 w-1/3 rounded bg-gray-300"></span>
          <small className="mb-2 h-4 w-1/2 rounded bg-gray-300"></small>
          <small className="h-4 w-1/4 rounded bg-gray-300"></small>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CardLoading;
