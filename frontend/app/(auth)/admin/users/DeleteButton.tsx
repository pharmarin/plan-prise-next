import Spinner from "@/components/icons/Spinner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/api";
import { TrashIcon } from "@heroicons/react/20/solid";

import type { User } from "@plan-prise/db-prisma";

const DeleteButton: React.FC<{
  user: Partial<User> & { id: User["id"] };
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const { isLoading, mutateAsync } = trpc.users.delete.useMutation();

  return (
    <Button
      disabled={isLoading}
      onClick={async () => {
        try {
          await mutateAsync(user.id);
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de la suppression de l'utilisateur",
          );
        }
      }}
      variant="destructive"
    >
      {isLoading ? <Spinner /> : <TrashIcon className="h-4 w-4" />}
    </Button>
  );
};

export default DeleteButton;
