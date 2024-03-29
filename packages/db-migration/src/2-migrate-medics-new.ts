/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { SingleBar } from "cli-progress";
import { trim } from "lodash-es";

import type { medics_simple } from "@plan-prise/db-prisma";
import prisma, { Prisma, VoieAdministration } from "@plan-prise/db-prisma";

/*
  INSTRUCTIONS: 

  pnpm prisma db push
  pnpm seed 2
*/

const parseJSONPromise = (json: string, nested = false) => {
  if (json.startsWith("{")) {
    json = `[${json}]`;
  }

  return new Promise((resolve, reject) => {
    try {
      return resolve(JSON.parse(json));
    } catch (error) {
      if (nested) {
        parseJSONPromise(`[${json}]`)
          .then((data) => resolve(data))
          .catch((data) => reject(data));
      }

      return reject(json);
    }
  });
};

const switchVoieAdministration = (med: medics_simple) => {
  switch (med.voieAdministration) {
    case "Orale":
      return VoieAdministration.ORALE;
    case "Cutanée":
      return VoieAdministration.CUTANEE;
    case "Auriculaire":
      return VoieAdministration.AURICULAIRE;
    case "Nasale":
      return VoieAdministration.NASALE;
    case "Inhalée":
      return VoieAdministration.INHALEE;
    case "Vaginale":
      return VoieAdministration.VAGINALE;
    case "Oculaire":
      return VoieAdministration.OCULAIRE;
    case "Rectale":
      return VoieAdministration.RECTALE;
    case "Sous-cutané":
    case "Sous-cutanée":
      return VoieAdministration.SOUS_CUTANEE;
    case "Intra-musculaire":
      return VoieAdministration.INTRA_MUSCULAIRE;
    case "Intra-veineux":
      return VoieAdministration.INTRA_VEINEUX;
    case "Intra-urétrale":
      return VoieAdministration.INTRA_URETRALE;
    default:
      return VoieAdministration.AUTRE;
  }
};

const migrateMedicsNew = async () => {
  console.log(
    "Migration n°2 : Migration de l'ancien vers le nouveau modèle Medicament",
  );

  const medics = await prisma.medics_simple.findMany();

  console.log("Migration en cours, %d medicaments à migrer", medics.length);

  const progressBar = new SingleBar({});

  progressBar.start(medics.length, 0);

  for (const med of medics) {
    if (!med.nomMedicament) {
      return;
    }

    try {
      await prisma.medicament.create({
        data: {
          medicamentOld: {
            connect: { id: med.id },
          },
          denomination: trim(med.nomMedicament),
          indications: trim(med.indication ?? "").split(" OU "),
          principesActifs: {
            connectOrCreate: trim(med.nomGenerique ?? "")
              .split(" + ")
              .map((principeActif) => ({
                where: { denomination: principeActif },
                create: { denomination: principeActif },
              })),
          },
          voiesAdministration: [switchVoieAdministration(med)],
          conservationFrigo: med.frigo,
          conservationDuree: med.dureeConservation
            ? await parseJSONPromise(med.dureeConservation)
                .then((json) => {
                  if (json && typeof json === "object") {
                    return Object.entries(json).map(([laboratoire, duree]) => ({
                      laboratoire,
                      duree,
                    })) as PP.Medicament.ConservationDuree;
                  } else {
                    console.error("Wrong format received");
                    process.exit(1);
                  }
                })
                .catch((duree) => [{ laboratoire: null, duree }])
            : undefined,
          commentaires: await parseJSONPromise(
            (med.commentaire! || "").replaceAll("\\'", "'"),
            true,
          )
            .then((json) => {
              if (Array.isArray(json)) {
                return {
                  create: json.map((commentaire) => {
                    if (
                      typeof commentaire === "object" &&
                      commentaire &&
                      "span" in commentaire &&
                      typeof commentaire.span === "string" &&
                      "text" in commentaire &&
                      typeof commentaire.text === "string"
                    ) {
                      return {
                        population: commentaire.span,
                        texte: commentaire.text
                          .replace(/<[^>]*>?/gm, "")
                          .replace("&nbsp;", " "),
                      };
                    } else {
                      console.log("Wrong commentaire type", commentaire);
                      process.exit(1);
                    }
                  }),
                };
              } else {
                console.error(
                  "Wrong commentaire type (not array)",
                  med.commentaire,
                );
                process.exit(1);
              }
            })
            .catch((_string) => {
              console.error("Wrong commentaire type (not json)");
              console.log(med.commentaire?.split("{"));
              process.exit(1);
            }),
          precaution: med.precaution
            ? {
                connect: { mot_cle: med.precaution },
              }
            : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2022: Unique constraint failed
        // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        if (error.code === "P2002") {
          console.error("Ce médicament est déjà inséré", med.nomMedicament);
          progressBar.increment();
          continue;
        }
      }

      throw error;
    }

    progressBar.increment();
  }
};

export default migrateMedicsNew;
