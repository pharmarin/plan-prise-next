import DeleteUser from "app/(auth)/profil/DeleteUser";
import EditInformations from "app/(auth)/profil/EditInformations";
import EditPassword from "app/(auth)/profil/EditPassword";
import { getServerSession } from "next-auth";
import prisma from "server/prisma/client";

const Profil = async () => {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { email: session?.user.email },
  });

  //useSetTitle("Profil");

  if (!user) {
    // TODO: Use CustomError
    throw new Error("L'utilisateur n'a pas pu être chargé");
  }

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Informations
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Vous trouverez ici les informations fournies lors de
              l&apos;inscription.
              <br />
              Vous pouvez les modifier à tout moment.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <EditInformations user={user} data-superjson />
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="my-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Mot de passe
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Vous pouvez ici modifier votre mot de passe.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <EditPassword user={user} data-superjson />
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="my-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Supprimer mon compte
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Demander la suppression immédiate de mon compte
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <DeleteUser id={user.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profil;
