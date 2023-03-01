import { TrashIcon } from "@heroicons/react/20/solid";
import { inferRouterOutputs } from "@trpc/server";
import Button from "components/forms/inputs/Button";
import Spinner from "components/icons/Spinner";
import { useAsyncCallback } from "react-async-hook";
import { AppRouter } from "server/trpc/routers/app";

type User = inferRouterOutputs<AppRouter>["users"]["findMany"][0];

const DeleteButton: React.FC<{
  user: User;
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { loading, execute: deleteUser } = useAsyncCallback(() => {
    // TODO: user.delete()
  });

  return (
    <Button
      color="red"
      disabled={loading}
      onClick={async () => {
        try {
          await deleteUser();
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de la suppression de l'utilisateur"
          );
        }
      }}
    >
      {loading ? <Spinner /> : <TrashIcon className="h-4 w-4" />}
    </Button>
  );
};

export default DeleteButton;
