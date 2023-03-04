import { trpc } from "@/common/trpc";
import Button from "@/components/forms/inputs/Button";
import Spinner from "@/components/icons/Spinner";
import { TrashIcon } from "@heroicons/react/20/solid";
import { type User } from "next-auth";

const DeleteButton: React.FC<{
  user: Partial<User> & { id: User["id"] };
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { isLoading, mutateAsync } = trpc.users.delete.useMutation();

  return (
    <Button
      color="red"
      disabled={isLoading}
      onClick={async () => {
        try {
          await mutateAsync(user.id);
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de la suppression de l'utilisateur"
          );
        }
      }}
    >
      {isLoading ? <Spinner /> : <TrashIcon className="h-4 w-4" />}
    </Button>
  );
};

export default DeleteButton;
