import prisma from "@/prisma";
import type { PlanDataItem } from "@/types/plan";
import { createId } from "@paralleldrive/cuid2";
import type { medics_simple } from "@prisma/client";
import { difference, trim } from "lodash";

const decodeUnicode = (value: string) =>
  value.replace(/\\u([\d\w]{4})/gi, (_match, grp) =>
    String.fromCharCode(parseInt(grp, 16))
  );

const formatString = (value: string) =>
  trim(value.replace("&nbsp;", " ").replace(/<[^>]*>?/gm, ""));

export const migratePlanNew = async () => {
  const plans = await prisma.plans_old.findMany({ take: 5 });

  for (const plan of plans) {
    if (!plan.user) {
      console.log("No user, skipping... ");
      continue;
    }

    let data = JSON.parse(plan.data) as (medics_simple & {
      dixhuith: string;
    })[];

    if (!Array.isArray(data)) {
      data = Object.values(data);
    }

    await prisma.plan.create({
      data: {
        user: {
          connect: { id: plan.user || "" },
        },
        medics: {
          connect: data.map((data: medics_simple) => ({
            denomination: data.nomMedicament || "",
          })),
        },
        data: Object.fromEntries(
          await data.reduce(async (accumulator, data) => {
            const medicament = await prisma.medicament.findFirstOrThrow({
              where: {
                denomination: data.nomMedicament || "",
              },
              include: { commentaires: true },
            });

            if (!Array.isArray(data.commentaire)) {
              console.error("Wrong commentaire type", data.nomMedicament, data);
              process.exit(1);
            }

            return accumulator.then((accu) => {
              accu.push([
                medicament.id,
                {
                  indications:
                    Array.isArray(medicament.indications) &&
                    medicament.indications.length === 1 &&
                    medicament.indications[0] === data.indication
                      ? undefined
                      : formatString(data.indication || ""),
                  posologies: {
                    poso_matin:
                      data.matin && data.matin.length > 0
                        ? formatString(data.matin)
                        : undefined,
                    poso_midi:
                      data.midi && data.midi.length > 0
                        ? formatString(data.midi)
                        : undefined,
                    poso_18h:
                      data.dixhuith && data.dixhuith.length > 0
                        ? formatString(data.dixhuith)
                        : undefined,
                    poso_soir:
                      data.soir && data.soir.length > 0
                        ? formatString(data.soir)
                        : undefined,
                    poso_coucher:
                      data.coucher && data.coucher.length > 0
                        ? formatString(data.coucher)
                        : undefined,
                    poso_10h: undefined,
                    poso_16h: undefined,
                  },
                  commentaires: Object.fromEntries(
                    medicament.commentaires.map((commentaire) => {
                      return [
                        commentaire.id,
                        {
                          checked: (() => {
                            if (Array.isArray(data.commentaire)) {
                              /* console.log(
                                "commentaire: ",
                                data.commentaire.find((com) => {
                                  return (
                                    decodeUnicode(com.text) ===
                                    commentaire.texte
                                  );
                                })
                              ); */

                              return (
                                data.commentaire.find((com) => {
                                  return (
                                    decodeUnicode(com.text) ===
                                    commentaire.texte
                                  );
                                })?.status === "checked"
                              );
                            } else {
                              console.error("Wrong comment type");
                              process.exit(1);
                            }
                          })(),
                        },
                      ];
                    })
                  ),
                  custom_commentaires: (() => {
                    if (Array.isArray(data.commentaire)) {
                      return difference(
                        data.commentaire.map((com) => decodeUnicode(com.text)),
                        medicament.commentaires.map((com) => com.texte)
                      ).reduce((accumulator, value) => {
                        accumulator[createId()] = { texte: value };

                        return accumulator;
                      }, {} as Record<string, { texte: string }>);
                    } else {
                      console.error("Wrong comment type") as unknown;
                      process.exit(1);
                    }
                  })(),
                },
              ] as [string, PlanDataItem]);

              return accu;
            });
          }, Promise.resolve([] as [string, PlanDataItem][]))
        ),
      },
    });
  }
};
