"use client";

import { PLAN_POSOLOGIE_COLOR } from "@/app/(auth)/plan/_lib/constants";
import {
  extractCommentaire,
  extractConservation,
  extractIndication,
  extractPosologiesSettings,
  extractVoieAdministration,
  parseData,
} from "@/app/(auth)/plan/_lib/functions";
import { Cell, Header, Row, Table } from "@/components/PDF";
import type { UserSession } from "@/prisma/types";
import {
  PlanPrisePosologies,
  type PlanInclude,
  type PlanSettings,
} from "@/types/plan";
import PP_Error from "@/utils/errors";
import { isCuid } from "@paralleldrive/cuid2";
import type { Prisma } from "@prisma/client";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const PrintPDF = ({
  plan,
  planData,
  planSettings,
  user,
}: {
  plan: PlanInclude;
  planData: Prisma.JsonValue;
  planSettings: Prisma.JsonValue;
  user: UserSession;
}) => {
  const tw = createTw({});

  const data = parseData(planData || plan.data);
  const posologies = extractPosologiesSettings(
    (planSettings as PlanSettings)?.posos,
  );

  const INFORMATIONS_WIDTH = "w-56";
  const INDICATION_WIDTH = "w-36";
  const POSOLOGIE_WIDTH = posologies.length > 6 ? "w-16" : "w-20";

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={tw("p-8 pb-12 relative")}>
        <View fixed>
          <View>
            <Text
              style={[
                tw("text-sm text-gray-800"),
                {
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              Un plan pour vous aider à mieux prendre vos médicaments
            </Text>
            <Text
              style={[
                tw("text-sm text-gray-800 mb-1"),
                {
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              Ceci n&apos;est pas une ordonnance.
            </Text>
          </View>
        </View>
        <Text
          style={tw("text-sm text-gray-800 absolute bottom-6 left-8")}
          fixed
        >
          Plan de prise n°{plan.displayId} édité par{" "}
          {user?.displayName || `${user?.firstName} ${user?.lastName}`} le{" "}
          {new Date().toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Text
          style={tw("text-sm text-gray-800 absolute bottom-6 right-8")}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} sur ${totalPages}`
          }
          fixed
        />
        <Table fixed>
          <Row>
            <Header className={`flex-initial ${INFORMATIONS_WIDTH}`}>
              Médicament
            </Header>
            <Header className={`flex-initial ${INDICATION_WIDTH}`}>
              Indication
            </Header>
            {posologies.map((posologie) => (
              <Header
                key={`header_${posologie}`}
                className={`flex-initial ${POSOLOGIE_WIDTH} ${PLAN_POSOLOGIE_COLOR?.[
                  posologie as "poso_matin"
                ]?.header} ${
                  posologies.length > 6 && posologie === "poso_coucher"
                    ? "text-xs"
                    : ""
                }`}
              >
                {
                  PlanPrisePosologies[
                    posologie as keyof typeof PlanPrisePosologies
                  ]
                }
              </Header>
            ))}
            <Header>Commentaires</Header>
          </Row>
        </Table>
        {[
          ...(Array.isArray(plan.medicsOrder)
            ? (plan.medicsOrder as string[])
            : []),
        ].map((medicamentId) => {
          const medicament = isCuid(medicamentId)
            ? plan.medics.find((medic) => medic.id === medicamentId)
            : { denomination: medicamentId };

          if (!medicament) {
            return undefined;
          }

          const rowData = medicamentId in data ? data[medicamentId] : {};

          const rowIndication = extractIndication(
            medicament,
            rowData.indication,
          );

          const rowFrigo =
            "conservationFrigo" in medicament && medicament.conservationFrigo
              ? "Se conserve au frigo avant ouverture"
              : "";

          const rowConservation = extractConservation(
            medicament,
            rowData.conservation,
          ).values.map((conservation, key) => {
            if (key > 1) {
              throw new PP_Error("PLAN_CONSERVATION_LENGTH_ERROR");
            }
            return `Se conserve ${conservation.duree}`;
          })[0];

          if (rowIndication.length > 1) {
            throw new PP_Error("PLAN_INDICATION_LENGTH_ERROR");
          }
          const rowPrincipesActifs =
            "principesActifs" in medicament
              ? medicament.principesActifs
                  .map((principeActif) => principeActif.denomination)
                  .join(", ")
              : "";

          const rowVoiesAdministration = `Voie ${extractVoieAdministration(
            medicament,
          ).join(" ou ")}`;

          const rowCommentaires =
            "commentaires" in medicament
              ? medicament.commentaires
                  .flatMap(
                    (commentaire) =>
                      extractCommentaire(
                        commentaire,
                        rowData.commentaires?.[commentaire.id],
                      ).checked && {
                        text: commentaire.texte,
                      },
                  )
                  .filter((item): item is { text: string } => item !== false)
              : [];

          const rowCustomCommentaires = Object.values(
            rowData.custom_commentaires || {},
          ).map((commentaire) => ({
            text: commentaire.texte,
          }));

          return (
            <Table key={medicamentId} className="border-t-0">
              <Row>
                <Cell
                  alignLeft
                  className={`flex-initial ${INFORMATIONS_WIDTH}`}
                  wrap={false}
                >
                  {[
                    { text: medicament?.denomination, bold: true },

                    {
                      text: rowPrincipesActifs,
                      className: "text-gray-700 text-sm mt-2",
                      italic: true,
                    },

                    {
                      text: rowVoiesAdministration,
                      className: "text-sm text-gray-600 mt-2",
                    },
                    {
                      text: rowFrigo,
                      className: "text-sm text-gray-600 mt-2",
                      italic: true,
                    },
                    {
                      text: rowConservation,
                      className: "text-sm text-gray-600 mt-2 mb-auto",
                      italic: true,
                    },
                  ].filter((line) => line.text !== "")}
                </Cell>
                <Cell className={`flex-initial ${INDICATION_WIDTH}`}>
                  {rowIndication[0]}
                </Cell>
                {posologies.map((posologie) => (
                  <Cell
                    key={`cell_${medicamentId}_${posologie}`}
                    className={`flex-initial ${POSOLOGIE_WIDTH} ${PLAN_POSOLOGIE_COLOR?.[
                      posologie as "poso_matin"
                    ]?.body} p-0`}
                  >
                    {rowData?.posologies?.[
                      posologie as keyof typeof PlanPrisePosologies
                    ] || ""}
                  </Cell>
                ))}
                <Cell alignLeft>
                  {[...rowCommentaires, ...rowCustomCommentaires]}
                </Cell>
              </Row>
            </Table>
          );
        })}
      </Page>
    </Document>
  );
};

export default PrintPDF;
