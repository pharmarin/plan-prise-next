"use client";

import ViewPDF from "@/app/(auth)/plan/[id]/print/ViewPDF";
import {
  extractCommentaire,
  extractConservation,
  extractIndication,
  extractVoieAdministration,
} from "@/app/(auth)/plan/_lib/functions";
import { Cell, Header, Row, Table } from "@/components/PDF";
import {
  PlanPrisePosologies,
  type PlanDataItem,
  type PlanInclude,
} from "@/types/plan";
import PP_Error from "@/utils/errors";
import { isCuid } from "@paralleldrive/cuid2";
import type { User } from "@prisma/client";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const POSOLOGIE_COLOR: Record<
  keyof typeof PlanPrisePosologies,
  { header: string; body: string }
> = {
  poso_lever: {
    header: "bg-indigo-300",
    body: "bg-indigo-200",
  },
  poso_matin: {
    header: "bg-green-300",
    body: "bg-green-200",
  },
  poso_10h: {
    header: "bg-yellow-300",
    body: "bg-yellow-200",
  },
  poso_midi: {
    header: "bg-orange-300",
    body: "bg-orange-200",
  },
  poso_16h: {
    header: "bg-pink-300",
    body: "bg-pink-200",
  },
  poso_18h: {
    header: "bg-purple-300",
    body: "bg-purple-200",
  },
  poso_soir: {
    header: "bg-red-300",
    body: "bg-red-200",
  },
  poso_coucher: {
    header: "bg-blue-300",
    body: "bg-blue-200",
  },
};

const PlanPrintClient = ({
  plan,
  planData,
  planMedicsOrder,
  planPosologies,
  user,
}: {
  plan: PlanInclude;
  planData: Record<string, PlanDataItem>;
  planPosologies: string[];
  planMedicsOrder: string[];
  user: Pick<User, "displayName" | "lastName" | "firstName">;
}) => {
  const tw = createTw({});

  const INFORMATIONS_WIDTH = "w-56";
  const INDICATION_WIDTH = "w-36";
  const POSOLOGIE_WIDTH = planPosologies.length > 6 ? "w-16" : "w-20";

  return (
    <ViewPDF>
      <Document>
        <Page
          orientation="landscape"
          size="A4"
          style={tw("p-8 pb-12 relative")}
        >
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
              {planPosologies.map((posologie) => (
                <Header
                  key={`header_${posologie}`}
                  className={`flex-initial ${POSOLOGIE_WIDTH} ${POSOLOGIE_COLOR?.[
                    posologie as "poso_matin"
                  ]?.header} ${
                    planPosologies.length > 6 && posologie === "poso_coucher"
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
          <Table>
            {[...planMedicsOrder, ...planMedicsOrder].map((medicamentId) => {
              const medicament = isCuid(medicamentId)
                ? plan.medics.find((medic) => medic.id === medicamentId)
                : { denomination: medicamentId };

              if (!medicament) {
                return undefined;
              }

              const rowData =
                medicamentId in planData ? planData[medicamentId] : {};

              const rowIndication = extractIndication(
                medicament,
                rowData.indication,
              );

              const rowFrigo =
                "conservationFrigo" in medicament &&
                medicament.conservationFrigo
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
                          ).checked && { text: commentaire.texte },
                      )
                      .filter(
                        (item): item is { text: string } => item !== false,
                      )
                  : [];

              const rowCustomCommentaires = Object.values(
                rowData.custom_commentaires || {},
              ).map((commentaire) => ({
                text: commentaire.texte,
              }));

              return (
                <Row key={medicamentId}>
                  <Cell
                    alignLeft
                    className={`flex-initial ${INFORMATIONS_WIDTH}`}
                  >
                    {[
                      { text: medicament?.denomination, bold: true },

                      {
                        text: rowPrincipesActifs,
                        className: "text-gray-700 text-sm",
                        italic: true,
                      },

                      {
                        text: rowVoiesAdministration,
                        className: "text-sm text-gray-600",
                      },
                      {
                        text: rowFrigo,
                        className: "text-sm text-gray-600",
                        italic: true,
                      },
                      {
                        text: rowConservation,
                        className: "text-sm text-gray-600",
                        italic: true,
                      },
                    ]}
                  </Cell>
                  <Cell className={`flex-initial ${INDICATION_WIDTH}`}>
                    {rowIndication[0]}
                  </Cell>
                  {planPosologies.map((posologie) => (
                    <Cell
                      key={`cell_${medicamentId}_${posologie}`}
                      className={`flex-initial ${POSOLOGIE_WIDTH} ${POSOLOGIE_COLOR?.[
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
              );
            })}
          </Table>
          {/*  <PageCount /> */}
        </Page>
      </Document>
    </ViewPDF>
  );
};

export default PlanPrintClient;
