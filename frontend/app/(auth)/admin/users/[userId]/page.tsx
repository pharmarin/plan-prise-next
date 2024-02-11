import Link from "next/link";
import { notFound } from "next/navigation";
import TestButton from "@/app/(auth)/admin/users/[userId]/approve-button";
import RPPSField from "@/app/(auth)/admin/users/[userId]/rpps-field";
import { routes } from "@/app/routes-schema";
import { Navigation } from "@/state/navigation";

import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";
import { Badge } from "@plan-prise/ui/badge";
import ShowPDF from "@plan-prise/ui/components/render-pdf";
import { Label } from "@plan-prise/ui/label";

const User = async ({ params }: { params: unknown }) => {
  try {
    const { userId } = routes.user.$parseParams(params);

    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });

    return (
      <>
        <Navigation title="Détail de l'utilisateur" returnTo={routes.users()} />
        <div className="relative">
          <TestButton approved={!!user.approvedAt} userId={userId} />
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Identité</Label>
              <div>
                {user.lastName} {user.firstName}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Affichage</Label>
              <div>{user.displayName ?? ""}</div>
            </div>
            <div className="space-y-1">
              <Label>Statut</Label>
              <div>
                {user.admin ? (
                  <Badge className="bg-red-400">Admin</Badge>
                ) : user.student ? (
                  <Badge className="bg-green-400">Étudiant</Badge>
                ) : (
                  <Badge className="bg-green-500">Pharmacien</Badge>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <div>
                <Link href={`mailto:${user.email}`}>{user.email || ""}</Link>
              </div>
            </div>
            {user.student ? (
              <div className="space-y-1">
                <Label>Justificatif d&apos;inscription</Label>
                <div>
                  {(() => {
                    if (
                      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                      user.certificate?.startsWith("data:image/jpeg") ||
                      user.certificate?.startsWith("data:image/png")
                    ) {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={`Certificat de scolarité pour ${user.firstName} ${user.lastName}`}
                          src={user.certificate}
                        />
                      );
                    }

                    if (user.certificate?.startsWith("data:application/pdf")) {
                      return <ShowPDF file={user.certificate} />;
                    }

                    return (
                      <p className="text-red-500">
                        {new PP_Error("UNEXPECTED_FILE_TYPE").message} :{" "}
                        {user.certificate?.split(";")[0]}
                      </p>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Label>Numéro RPPS</Label>
                <RPPSField rpps={String(user.rpps)} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    error instanceof Error && console.error("error: ", error.message);
    notFound();
  }
};

export default User;