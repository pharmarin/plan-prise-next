/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { createId } from "@paralleldrive/cuid2";
import { SingleBar } from "cli-progress";
import { difference, trim } from "lodash";

import type { medics_simple, Prisma } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

const decodeUnicode = (value: string) =>
  (value || "").replace(/\\u([\d\w]{4})/gi, (_match, grp) =>
    String.fromCharCode(parseInt(grp, 16)),
  );

const formatString = (value: string) =>
  trim((value || "").replace("&nbsp;", " ").replace(/<[^>]*>?/gm, ""));

export const migratePlanNew = async () => {
  console.log(
    "Migration n°3 : Migration de l'ancien vers le nouveau modèle Plan",
  );

  const plansCount = await prisma.plans_old.count();

  console.log("Migration en cours, %d plans à migrer", plansCount);

  const progressBar = new SingleBar({});

  progressBar.start(plansCount, 0);

  for (let i = 0; i < plansCount; i++) {
    const plan = await prisma.plans_old.findFirst({ skip: i });

    if (!plan) {
      continue;
    }

    if (!plan.user) {
      console.log("\nNo user, skipping... ");
      progressBar.increment();
      continue;
    }

    if (!plan.data) {
      console.log("\nNo data, skipping...");
      progressBar.increment();
      continue;
    }

    console.log("\nParsing: ", plan.id);

    let data = JSON.parse(plan.data) as (medics_simple & {
      dixhuith: string;
      lever: string;
    })[];

    if (!Array.isArray(data)) {
      data = Object.values(data);
    }

    const medicamentArray = await Promise.all(
      data.map((medicament) =>
        medicament.id
          ? prisma.medicament.findFirstOrThrow({
              where: {
                denomination: decodeUnicode(
                  trim(medicament.nomMedicament ?? ""),
                )
                  .replace("UN-ALPHA", "UN-ALFA")
                  .replace(
                    "HEMIGOXINE NATIVELLE 0,25 mg",
                    "HEMIGOXINE NATIVELLE 0,125 mg",
                  )
                  .replace(
                    "ACIDE URSODEOXYCHOLIQUE",
                    "ACIDE URSODESOXYCHOLIQUE",
                  ),
              },
              include: { commentaires: true },
            })
          : { denomination: medicament.nomMedicament },
      ),
    );

    const medicData: Record<string, PP.Plan.DataItem> = Object.fromEntries(
      medicamentArray.map((medicament) => {
        const customData = data.find((old) =>
          "id" in medicament && "id" in old
            ? old.id === medicament.medics_simpleId
            : old.nomMedicament === medicament.denomination,
        );

        const dataObject: PP.Plan.DataItem = {
          indication:
            "id" in medicament
              ? Array.isArray(medicament.indications) &&
                medicament.indications.length === 1 &&
                medicament.indications[0] === customData?.indication
                ? undefined
                : formatString(customData?.indication ?? "")
              : formatString(customData?.indication ?? ""),
          posologies:
            customData?.lever ??
            customData?.matin ??
            customData?.midi ??
            customData?.dixhuith ??
            customData?.soir ??
            customData?.coucher
              ? {
                  poso_lever:
                    customData?.lever && customData?.lever.length > 0
                      ? formatString(customData?.lever)
                      : undefined,
                  poso_matin:
                    customData?.matin && customData?.matin.length > 0
                      ? formatString(customData?.matin)
                      : undefined,
                  poso_midi:
                    customData?.midi && customData?.midi.length > 0
                      ? formatString(customData?.midi)
                      : undefined,
                  poso_18h:
                    customData?.dixhuith && customData?.dixhuith.length > 0
                      ? formatString(customData?.dixhuith)
                      : undefined,
                  poso_soir:
                    customData?.soir && customData?.soir.length > 0
                      ? formatString(customData?.soir)
                      : undefined,
                  poso_coucher:
                    customData?.coucher && customData?.coucher.length > 0
                      ? formatString(customData?.coucher)
                      : undefined,
                  poso_10h: undefined,
                  poso_16h: undefined,
                }
              : undefined,
          commentaires:
            "id" in medicament && Array.isArray(customData?.commentaire)
              ? Object.fromEntries(
                  medicament.commentaires.map((commentaire) => {
                    return [
                      commentaire.id,
                      {
                        checked: (() => {
                          if (Array.isArray(customData?.commentaire)) {
                            return (
                              customData?.commentaire.find((com) => {
                                return (
                                  decodeUnicode(com.text) === commentaire.texte
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
                  }),
                )
              : undefined,
          custom_commentaires: (() => {
            if (medicament) {
              if (
                "id" in medicament &&
                Array.isArray(customData?.commentaire)
              ) {
                return difference(
                  customData?.commentaire.map((com) => decodeUnicode(com.text)),
                  medicament.commentaires.map((com) => com.texte),
                ).reduce(
                  (accumulator, value) => {
                    accumulator[createId()] = { texte: value };

                    return accumulator;
                  },
                  {} as Record<string, { texte: string }>,
                );
              } else {
                if (
                  typeof customData?.commentaire === "string" &&
                  customData?.commentaire.length > 0
                ) {
                  return {
                    [createId()]: { texte: customData?.commentaire },
                  };
                }
              }
            } else {
              if (Array.isArray(customData?.commentaire)) {
                return customData?.commentaire
                  ? Object.fromEntries(
                      customData?.commentaire.map((com) => [
                        createId(),
                        { texte: decodeUnicode(com.texte) },
                      ]),
                    )
                  : undefined;
              } else {
                return customData?.commentaire &&
                  customData?.commentaire.length > 0
                  ? { [createId()]: { texte: customData?.commentaire } }
                  : undefined;
              }
            }
          })(),
        };

        (Object.keys(dataObject) as (keyof typeof dataObject)[]).forEach(
          (key) =>
            (dataObject[key] === undefined || dataObject[key] === "") &&
            delete dataObject[key],
        );

        return [
          "id" in medicament ? medicament.id : medicament.denomination,
          dataObject,
        ];
      }),
    );

    Object.keys(medicData).forEach(
      (key) =>
        Object.keys(medicData[key]).length === 0 && delete medicData[key],
    );

    await prisma.plan.create({
      data: {
        displayId: plan.id,
        user: {
          connect: { id: plan.user },
        },
        medics: {
          connect: medicamentArray
            .map((medicament) =>
              "id" in medicament
                ? {
                    id: medicament.id,
                  }
                : undefined,
            )
            .filter(
              (connector): connector is { id: string } =>
                connector?.id !== undefined,
            ),
        } as Prisma.PlanCreateInput["medics"],
        medicsOrder: medicamentArray.map((medicament) =>
          "id" in medicament ? medicament.id : medicament.denomination,
        ),
        data: medicData,
      },
    });

    progressBar.increment();
  }
};
