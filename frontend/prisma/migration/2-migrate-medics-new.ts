import prisma from "@/prisma";
import type { MedicamentConservationDuree } from "@/types/medicament";
import { VoieAdministration, type medics_simple } from "@prisma/client";
import { trim } from "lodash";

/*
  TODO: 

  pnpm prisma db push
  pnpm seed 2

  WARNING: 
  - Phloroglucinol: Missing [] arround commentaire value
  - COTELLIX, LENVIMA, GALAFOLD are inserted twice
  - \' cause error
*/

const parseJSONPromise = (json: string) =>
  new Promise((resolve, reject) => {
    try {
      return resolve(JSON.parse(json));
    } catch (error) {
      console.error("JSON parse error: ", error);
      return reject(json);
    }
  });

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
  const medics = await prisma.medics_simple.findMany();

  for (const med of medics) {
    if (!med.nomMedicament) {
      return;
    }

    console.log(`Importation de ${med.nomMedicament}`);

    await prisma.medicament.create({
      data: {
        medicamentOld: {
          connect: { id: med.id },
        },
        denomination: trim(med.nomMedicament),
        indications: trim(med.indication || "").split(" OU "),
        principesActifs: {
          connectOrCreate: trim(med.nomGenerique || "")
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
                  })) as MedicamentConservationDuree;
                } else {
                  console.error("Wrong format received");
                  process.exit(1);
                }
              })
              .catch((duree) => [{ laboratoire: null, duree }])
          : undefined,
        commentaires: await parseJSONPromise(
          ((med.commentaire as string) || "").replace("\\'", "'")
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
              console.error("Wrong commentaire type", med.commentaire);
              process.exit(1);
            }
          })
          .catch((_string) => {
            console.error("Wrong commentaire type", med.commentaire);
            process.exit(1);
          }),
        precaution: med.precaution,
      },
    });
  }
};

export default migrateMedicsNew;
