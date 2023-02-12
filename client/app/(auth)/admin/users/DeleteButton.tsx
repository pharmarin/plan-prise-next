import { TrashIcon } from "@heroicons/react/20/solid";
import Button from "components/forms/inputs/Button";
import Spinner from "components/icons/Spinner";
import User from "lib/redux/models/User";
import { useAsyncCallback } from "react-async-hook";

const DeleteButton: React.FC<{
  user: User;
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { loading, execute: deleteUser } = useAsyncCallback(() =>
    user.delete()
  );

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
