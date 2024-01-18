import { Navigation } from "@/app/state-navigation";
import {
  extractVoieAdministration,
  switchVoieAdministration,
} from "@/utils/medicament";
import { SnowflakeIcon } from "lucide-react";

import prisma from "@plan-prise/db-prisma";
import { Badge } from "@plan-prise/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@plan-prise/ui/shadcn/ui/card";
import { Label } from "@plan-prise/ui/shadcn/ui/label";
import { TypographyList } from "@plan-prise/ui/shadcn/ui/typography";

const Medicament = async ({ params }: { params: { id: string } }) => {
  const medicament = await prisma.medicament.findFirstOrThrow({
    where: { id: params.id },
    include: { commentaires: true, precaution: true, principesActifs: true },
  });

  return (
    <>
      <Navigation title={medicament.denomination} returnTo={"/admin/medics"} />
      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Principes actifs</Label>
          <div className="space-x-2">
            {medicament.principesActifs.map((principeActif) => (
              <Badge key={principeActif.id} variant="outline">
                {principeActif.denomination}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label>Voies d&apos;administration</Label>
          <TypographyList>
            {extractVoieAdministration(medicament).map((voieAdministration) => (
              <li key={voieAdministration}>
                <span className="text-muted-foreground">Voie</span>{" "}
                {voieAdministration}
              </li>
            ))}
          </TypographyList>
        </div>
        <div className="space-y-1">
          <Label>Indications</Label>
          <TypographyList>
            {medicament.indications.map((indication, index) => (
              <li key={index}>{indication}</li>
            ))}
          </TypographyList>
        </div>
        <div className="space-y-1">
          <Label>Conservation</Label>
          {medicament.conservationFrigo && (
            <p className="italic">
              <SnowflakeIcon className="mb-1 inline-block h-4 w-4" /> Se
              conserve au réfrigérateur avant ouverture
            </p>
          )}
          <TypographyList>
            {(medicament.conservationDuree ?? []).map((conservation, index) => (
              <li key={index}>
                {conservation.laboratoire && `[${conservation.laboratoire}]`}{" "}
                {conservation.duree}
              </li>
            ))}
          </TypographyList>
        </div>
        <div className="space-y-1">
          <Label>Plus d&apos;informations</Label>
          <p>
            Créé le{" "}
            {medicament.createdAt.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
            {medicament.updatedAt &&
              ` et mis à jour le ${medicament.updatedAt.toLocaleDateString(
                "fr-FR",
                {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                },
              )}`}
          </p>
        </div>
        <div className="space-y-1">
          <Label>Commentaires associés</Label>
          <div className="grid grid-cols-4 gap-4">
            {medicament.commentaires.map((commentaire) => (
              <Card key={commentaire.id}>
                <CardContent className="mt-6">
                  <p>{commentaire.texte}</p>
                  {commentaire.population && (
                    <p className="italic text-muted-foreground">
                      Concerne la population suivante : {commentaire.population}
                    </p>
                  )}
                  {commentaire.voieAdministration && (
                    <p className="italic text-muted-foreground">
                      Concerne la voie d&apos;administration suivante :{" "}
                      {switchVoieAdministration(commentaire.voieAdministration)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {medicament.precaution && (
          <div className="space-y-1">
            <Label>Précaution associée</Label>
            <div className="max-w-xl">
              <Card style={{ borderColor: medicament.precaution.couleur }}>
                <CardHeader>
                  <CardTitle>{medicament.precaution.titre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: medicament.precaution.contenu,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Medicament;
