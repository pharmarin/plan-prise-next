import Link from "next/link";
import { notFound } from "next/navigation";
import TestButton from "@/app/(auth)/admin/utilisateurs/[id]/approve-button";
import RPPSField from "@/app/(auth)/admin/utilisateurs/[id]/rpps-field";
import { Navigation } from "@/app/state-navigation";

import prisma from "@plan-prise/db-prisma";
import PP_Error from "@plan-prise/errors";
import ShowPDF from "@plan-prise/ui/components/render-pdf";
import { Badge } from "@plan-prise/ui/shadcn/ui/badge";
import { Label } from "@plan-prise/ui/shadcn/ui/label";

const PAGE_TITLE = "Détail de l'utilisateur";

const User = async ({ params }: { params: { id: string } }) => {
  const user = await prisma.user.findFirst({ where: { id: params.id } });

  if (!user) {
    return notFound();
  }

  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo="/admin/utilisateurs" />
      <div className="relative">
        <TestButton approved={!!user.approvedAt} userId={params.id} />
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
                    user.certificate?.startsWith("data:image/jpeg") ??
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

                  throw new PP_Error("UNEXPECTED_FILE_TYPE");
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
};

export const metadata = {
  title: PAGE_TITLE,
};

export default User;
