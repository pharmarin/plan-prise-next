import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime";

type PlanPrisePrecaution = {
  checked?: boolean;
  comment: string;
};

type PlanPriseDataItem = {
  indications?: string;
  posologies?: Record<PlanPrisePosologies, string | undefined>;
  precautions?: Record<string, PlanPrisePrecaution>;
  custom_precautions?: Record<string, PlanPrisePrecaution>;
};

type PlanPriseData = Record<string, PlanPriseDataItem>;

type PlanPrisePosologies =
  | "poso_matin"
  | "poso_10h"
  | "poso_midi"
  | "poso_16h"
  | "poso_18h"
  | "poso_soir"
  | "poso_coucher";

export const migratePlanNew = async () => {
  const plans = {
    id: 8,
    user: "cliupf2370000lqxkraf2606t",
    data: [
      {
        id: "90",
        nomMedicament: "VOLTARENDOLO 12,5 mg",
        nomGenerique: "Diclof\\u00e9nac",
        indication: "Contre les douleurs inflammatoires",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "2",
        midi: "4",
        soir: "2",
        coucher: "",
        commentaire: [
          {
            text: "Avaler les comprim\\u00e9s avec un grand verre d'eau, sans les croquer et sans les \\u00e9craser.",
            span: "",
            status: "checked",
          },
          {
            text: "\\u00c0 prendre de pr\\u00e9f\\u00e9rence au cours des repas (meilleure tol\\u00e9rance digestive).",
            span: "",
            status: "",
          },
          {
            text: "Ne pas utiliser au cours des 2<sup>\\u00e8me<\\/sup> et 3<sup>\\u00e8me<\\/sup> trimestres de la grossesse et de l'allaitement.",
            span: "",
            status: "checked",
          },
        ],
        precaution: "",
      },
      {
        id: "1467",
        nomMedicament: "BONVIVA 150 mg",
        nomGenerique: "Acide ibandronique",
        indication: "Contre l'ost\\u00e9oporose",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: "",
        commentaire: [
          {
            text: "\\u00c0 prendre une seule fois par mois.",
            span: "",
            status: "checked",
          },
          {
            text: "\\u00c0 prendre le matin, 1h avant le petit d\\u00e9jeuner avec un grand verre d'eau faiblement min\\u00e9ralis\\u00e9 (eau du robinet).",
            span: "",
            status: "checked",
          },
          {
            text: "Ne pas s'allonger dans les 30 minutes qui suivent la prise.",
            span: "",
            status: "checked",
          },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "142",
        nomMedicament: "DOLIPRANE 1000 mg",
        nomGenerique: "Parac\\u00e9tamol",
        indication: "Contre les douleurs et la fi\\u00e8vre",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "3<br>",
        midi: "",
        soir: "",
        coucher: "",
        commentaire: [
          {
            text: "Espacer chaque prise de 4 \\u00e0 6 heures.",
            span: "",
            status: "checked",
          },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "3532",
        nomMedicament:
          "EFAVIRENZ\\/EMTRICITABINE\\/TENOFOVIR 600 mg\\/200 mg\\/24",
        nomGenerique: "Efavirenz + Emtricitabine + T\\u00e9nofovir",
        indication: "Antiviral",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: "1121",
        commentaire: [
          {
            text: "\\u00c0 prendre \\u00e0 jeun (2h avant ou apr\\u00e8s le repas),&nbsp;de pr\\u00e9f\\u00e9rence le soir au coucher.",
            span: "",
            status: "checked",
          },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "3554",
        nomMedicament: "XELJANZ 5 mg",
        nomGenerique: "Tofacitinib",
        indication: "Pour la polyarthrite rhumato\\u00efde",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: null,
        commentaire: [
          {
            text: "\\u00c0 prendre au cours ou en dehors des repas.&nbsp;",
            span: "",
            status: "checked",
          },
          {
            text: "Le comprim\\u00e9 peut \\u00eatre \\u00e9cras\\u00e9 et pris avec de l'eau",
            span: "Si difficult\\u00e9s \\u00e0 avaler",
            status: "",
          },
          { text: "", span: "", status: "checked" },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "3555",
        nomMedicament: "MOVENTIG 12,5 mg",
        nomGenerique: "Nalox\\u00e9gol",
        indication: "Contre la constipation",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: null,
        commentaire: [
          {
            text: "\\u00c0 prendre au moins 30 minutes avant (ou 2 heures apr\\u00e8s) le premier repas de la journ\\u00e9e.&nbsp;",
            span: "",
            status: "checked",
          },
          {
            text: "Le comprim\\u00e9 peut \\u00eatre \\u00e9cras\\u00e9 en poudre et m\\u00e9lang\\u00e9 \\u00e0 un demi-verre d'eau. Boire imm\\u00e9diatement et rincer avec un autre demi-verre d'eau dont le contenu doit \\u00eatre bu.&nbsp;",
            span: "Si difficult\\u00e9s \\u00e0 avaler",
            status: "",
          },
          { text: "", span: "", status: "checked" },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "3550",
        nomMedicament: "LONSURF 15 mg\\/6,14 mg",
        nomGenerique: "Trifluridine + Tipiracil",
        indication: "Contre le cancer de la thyro\\u00efde",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: null,
        commentaire: [
          {
            text: "\\u00c0 prendre avec un verre d'eau dans l'heure suivant la fin du repas.&nbsp;",
            span: "",
            status: "checked",
          },
          {
            text: "Se laver les mains apr\\u00e8s avoir manipul\\u00e9 les comprim\\u00e9s.&nbsp;",
            span: "",
            status: "checked",
          },
          { text: "", span: "", status: "checked" },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "3556",
        nomMedicament: "MOVENTIG 25 mg",
        nomGenerique: "Nalox\\u00e9gol",
        indication: "Contre la constipation",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: null,
        commentaire: [
          {
            text: "\\u00c0 prendre au moins 30 minutes avant (ou 2 heures apr\\u00e8s) le premier repas de la journ\\u00e9e.&nbsp;",
            span: "",
            status: "checked",
          },
          {
            text: "Le comprim\\u00e9 peut \\u00eatre \\u00e9cras\\u00e9 en poudre et m\\u00e9lang\\u00e9 \\u00e0 un demi-verre d'eau. Boire imm\\u00e9diatement et rincer avec un autre demi-verre d'eau dont le contenu doit \\u00eatre bu.&nbsp;",
            span: "Si difficult\\u00e9s \\u00e0 avaler",
            status: "",
          },
        ],
        precaution: "",
        commentairePerso: "",
        options: "",
      },
      {
        id: "2421",
        nomMedicament: "MINISINTROM 1 mg",
        nomGenerique: "Ac\\u00e9nocoumarol",
        indication:
          "Pour \\u00e9viter la formation de caillots dans le sang OU Pour dissoudre le caillot de sang OU Pour fluidifier le sang",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: null,
        commentaire: [
          {
            text: "\\u00c0 prendre \\u00e0 heure r\\u00e9guli\\u00e8re.",
            span: "",
            status: "checked",
          },
          {
            text: "En cas d'oubli, la prise est possible jusqu'\\u00e0 8 heures apr\\u00e8s l'heure de prise habituelle. Au del\\u00e0, ne pas prendre le comprim\\u00e9.",
            span: "",
            status: "checked",
          },
        ],
        precaution: "avk",
        commentairePerso: "",
        options: "",
        dixhuith: "\\u00e9",
      },
      {
        id: "2428",
        nomMedicament: "ELIQUIS 2,5 mg",
        nomGenerique: "Apixaban",
        indication:
          "\\nPour \\u00e9viter la formation de caillots dans le sang ",
        frigo: "0",
        dureeConservation: "",
        voieAdministration: "Orale",
        matin: "",
        midi: "",
        soir: "",
        coucher: null,
        commentaire: [
          {
            text: "\\u00c0 prendre \\u00e0 heure r\\u00e9guli\\u00e8re, pendant ou en dehors des repas.",
            span: "",
            status: "checked",
          },
          {
            text: "En cas d'oubli, prendre la dose oubli\\u00e9e d\\u00e8s que possible en continuant le rythme de 2 prises par jour.",
            span: "",
            status: "checked",
          },
          {
            text: "Il est possible d'\\u00e9craser les comprim\\u00e9s et de les dissoudre dans de l'eau, du jus de pomme ou de la compote de pommes. Administrer imm\\u00e9diatement apr\\u00e8s dissolution.",
            span: "Si difficult\\u00e9s de d\\u00e9glutition",
            status: "",
          },
        ],
        precaution: "anticoagulant",
        commentairePerso: "",
        options: "",
      },
      {
        nomMedicament: "GELSEMIUM 9 CH",
        nomGenerique: "",
        indication: "",
        voieAdministration: "",
        frigo: "",
        dureeConservation: "",
        commentaire: "",
        commentairePerso: "",
        options: "",
        matin: "",
        midi: "",
        soir: "",
      },
    ],
    options: {
      poso: {
        lever: "Lever",
        matin: "Matin",
        dixh: "10 h",
        midi: "Midi",
        seizeh: "16 h",
        dixhuith: "18 h",
        soir: "Soir",
        coucher: "Coucher",
      },
    },
    TIME: "2018-02-20T19:14:30.000Z",
  };

  const medic = {
    id: 90,
    nomMedicament: "VOLTARENDOLO 12,5 mg",
    nomGenerique: "Diclofénac",
    indication: "Contre les douleurs inflammatoires",
    frigo: false,
    dureeConservation: null,
    voieAdministration: "Orale",
    matin: null,
    midi: null,
    soir: null,
    coucher: null,
    commentaire: `[{"text":"Avaler les comprimés avec un grand verre d'eau, sans les croquer et sans les écraser.","span":"","status":"checked"},{"text":"À prendre de préférence au cours des repas (meilleure tolérance digestive).","span":"","status":"checked"},{"text":"Ne pas utiliser au cours des 2<sup>ème</sup> et 3<sup>ème</sup> trimestres de la grossesse et de l'allaitement.","span":"","status":"checked"}]`,
    modifie: "NOW()",
    precaution: null,
    qui: null,
    relecture: 0,
    stat: 0,
  };

  console.log("medic: ", medic);

  console.log("plan", JSON.stringify(plans));

  console.log(
    "diff",
    JSON.stringify({
      data: Object.fromEntries(
        plans.data.map((data) => [
          data.id,
          {
            indications: data.indication,
            posologies: {
              poso_matin: data.matin,
              poso_midi: data.midi,
              poso_18h: data.dixhuith,
              poso_soir: data.soir,
              poso_coucher: data.coucher,
              poso_10h: undefined,
              poso_16h: undefined,
            },
            precautions: {},
          } as PlanPriseDataItem,
        ])
      ) as PlanPriseData,
    }) as Prisma.PlanCreateArgs<DefaultArgs>
  );
};
