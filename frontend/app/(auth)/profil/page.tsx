import DeleteUser from "@/app/(auth)/profil/form-delete";
import EditInformations from "@/app/(auth)/profil/form-informations";
import EditPassword from "@/app/(auth)/profil/form-password";
import { Navigation } from "@/app/state-navigation";

import { getServerSession } from "@plan-prise/auth/get-session";
import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";

const PAGE_TITLE = "Profil";

const Profil = async () => {
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id ?? "" },
  });

  if (!user) {
    throw new PP_Error("USER_LOADING_ERROR");
  }

  return (
    <>
      <Navigation title={PAGE_TITLE} />
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
          <EditInformations
            user={{
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              displayName: user.displayName,
              rpps: user.rpps,
              email: user.email,
              student: user.student,
            }}
            data-superjson
          />
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
            <EditPassword />
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
            <DeleteUser />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profil;

export const metadata = { title: PAGE_TITLE };
