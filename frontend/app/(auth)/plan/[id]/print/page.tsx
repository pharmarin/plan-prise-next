import ViewPDF from "@/app/(auth)/plan/[id]/print/ViewPDF";
import { PLAN_SETTINGS_DEFAULT } from "@/app/(auth)/plan/_lib/constants";
import {
  extractCommentaire,
  extractConservation,
  extractIndication,
  extractVoieAdministration,
  parseData,
} from "@/app/(auth)/plan/_lib/functions";
import { Cell, Header, Row, Table } from "@/components/PDF";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { PlanPrisePosologies } from "@/types/plan";
import PP_Error from "@/utils/errors";
import { isCuid } from "@paralleldrive/cuid2";
import { Document, Page } from "@react-pdf/renderer";
import { merge } from "lodash";
import { notFound } from "next/navigation";
import { createTw } from "react-pdf-tailwind";

const INFORMATIONS_WIDTH = "w-56";
const INDICATION_WIDTH = "w-36";
const POSOLOGIE_WIDTH = "w-20";

const PlanPrint = async ({ params }: { params: { id: string } }) => {
  const tw = createTw({});

  const session = await getServerSession();

  const plan = await prisma.plan.findFirst({
    where: { displayId: Number(params.id), user: { id: session?.user.id } },
    include: {
      medics: {
        include: { commentaires: true, principesActifs: true },
      },
    },
  });

  if (!plan) {
    return notFound();
  }

  const planPosologies = Object.entries(
    merge(PLAN_SETTINGS_DEFAULT, plan.settings).posos,
  )
    .filter(
      ([posologie, enabled]) =>
        enabled && Object.keys(PlanPrisePosologies).includes(posologie),
    )
    .map(([posologie]) => posologie);

  const planMedicsOrder = Array.isArray(plan.medicsOrder)
    ? (plan.medicsOrder as string[])
    : [];

  const planData = parseData(plan.data);

  return (
    <ViewPDF className="h-screen w-full">
      <Document>
        <Page orientation="landscape" size="A4" style={tw("p-8")}>
          <Table>
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
                  className={`flex-initial ${POSOLOGIE_WIDTH}`}
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
            {planMedicsOrder.map((medicamentId) => {
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
                      className={`flex-initial ${POSOLOGIE_WIDTH} p-0`}
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
        </Page>
      </Document>
    </ViewPDF>
  );
};

export default PlanPrint;
