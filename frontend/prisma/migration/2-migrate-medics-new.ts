import prisma from "@/prisma";
import { VoieAdministration } from "@prisma/client";
import { trim } from "lodash";

const parseJSONPromise = (json: string) =>
  new Promise((resolve, reject) => {
    try {
      return resolve(JSON.parse(json));
    } catch (error) {
      return reject(json);
    }
  });

const switchVoieAdministration = (voie: string) => {
  switch (voie) {
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
    case "Sous-cutanée":
      return VoieAdministration.SOUS_CUTANEE;
    case "Intra-musculaire":
      return VoieAdministration.INTRA_MUSCULAIRE;
    case "Intra-veineux":
      return VoieAdministration.INTRA_VEINEUX;
    case "Intra-urétrale":
      return VoieAdministration.INTRA_URETRALE;
    default:
      console.error("Unknown voie administration");
      process.exit(1);
  }
};

const migrateMedicsNew = async () => {
  const medics = await prisma.medics_simple.findMany();

  medics.forEach(async (med) => {
    if (!med.nomMedicament) {
      return;
    }

    console.log(`Importation de ${med.nomMedicament}`);

    await prisma.medicament.create({
      data: {
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
        voiesAdministration: switchVoieAdministration(
          med.voieAdministration || ""
        ),
        conservation_frigo: med.frigo,
        conservation_duree: med.dureeConservation
          ? await parseJSONPromise(med.dureeConservation).then((json) => {
              if (json && typeof json === "object") {
                return Object.entries(json).map(([laboratoire, duree]) => ({
                  laboratoire,
                  duree,
                }));
              } else {
                console.error("Wrong format received");
                process.exit(1);
              }
            })
          : undefined,
        precautions: Array.isArray(med.commentaire)
          ? {
              create: med.commentaire.map((commentaire) => {
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
                    texte: commentaire.text,
                  };
                } else {
                  console.log("Wring commentaire type", commentaire);
                  process.exit(1);
                }
              }),
            }
          : (console.error("Wrong commentaire type", med.commentaire) as any) &&
            process.exit(1),
      },
    });

    console.log("commentaire: ", med.precaution);
    process.exit();
  });
};

export default migrateMedicsNew;
