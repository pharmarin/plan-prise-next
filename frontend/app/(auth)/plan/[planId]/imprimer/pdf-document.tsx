import { PLAN_POSOLOGIE_COLOR } from "@/app/(auth)/plan/constants";
import {
  extractCommentaire,
  extractConservation,
  extractIndication,
  extractPosologiesSettings,
} from "@/app/(auth)/plan/functions";
import CommonPdf from "@/app/modules-pdf-base";
import { PlanPrisePosologies } from "@/types/plan";
import { extractVoieAdministration } from "@/utils/medicament";
import { isCuid } from "@paralleldrive/cuid2";
import type { Plan, Precaution } from "@prisma/client";
import { Text, View } from "@react-pdf/renderer";
import { uniqBy } from "lodash-es";
import Html from "react-pdf-html";
import { createTw } from "react-pdf-tailwind";

import type { UserSession } from "@plan-prise/auth/types";
import PP_Error from "@plan-prise/errors";
import { Cell, Header, Row, Table } from "@plan-prise/ui/components/PDF";

const PrintPDF = ({
  medicaments,
  plan,
  user,
}: {
  medicaments: PP.Medicament.Include[];
  plan: Plan;
  user: UserSession;
}) => {
  const tw = createTw({});

  const posologies = extractPosologiesSettings(plan.settings?.posos);
  const precautions = uniqBy(
    medicaments
      .flatMap((medic) => medic.precaution)
      .filter(
        (precaution): precaution is Precaution =>
          !!precaution && "id" in precaution,
      ),
    "id",
  );

  const INFORMATIONS_WIDTH = "w-56";
  const INDICATION_WIDTH = "w-36";
  const POSOLOGIE_WIDTH = posologies.length > 6 ? "w-16" : "w-20";

  return (
    <CommonPdf
      header="Un plan pour vous aider à mieux prendre vos médicaments"
      footer={`Plan de prise n°${plan.displayId} édité par ${user?.displayName ?? `${user?.firstName} ${user?.lastName}`} le ${new Date().toLocaleString(
        "fr-FR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      )}`}
    >
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
              className={`flex-initial ${POSOLOGIE_WIDTH} ${
                PLAN_POSOLOGIE_COLOR?.[posologie as "poso_matin"]?.header
              } ${
                posologies.length > 6 && posologie === "poso_coucher"
                  ? "text-xs"
                  : ""
              }`}
            >
              {PlanPrisePosologies[posologie]}
            </Header>
          ))}
          <Header>Commentaires</Header>
        </Row>
      </Table>
      {Object.keys(plan.data ?? {}).map((medicamentId) => {
        const medicament = isCuid(medicamentId)
          ? medicaments.find((medic) => medic.id === medicamentId)
          : { denomination: medicamentId };

        if (!medicament) {
          return undefined;
        }

        const rowData = plan.data?.[medicamentId] ?? {};

        const rowIndication = extractIndication(medicament, rowData.indication);

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

        const rowVoiesAdministration =
          "id" in medicament
            ? `Voie ${extractVoieAdministration(medicament).join(" ou ")}`
            : "";

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
          rowData.custom_commentaires ?? {},
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
                  { text: medicament?.denomination || "", bold: true },

                  {
                    text: rowPrincipesActifs || "",
                    className: "text-gray-700 text-sm mt-2",
                    italic: true,
                  },

                  {
                    text: rowVoiesAdministration || "",
                    className: "text-sm text-gray-600 mt-2",
                  },
                  {
                    text: rowFrigo || "",
                    className: "text-sm text-gray-600 mt-2",
                    italic: true,
                  },
                  {
                    text: rowConservation ?? "",
                    className: "text-sm text-gray-600 mt-2 mb-auto",
                    italic: true,
                  },
                ].filter((line) => line.text !== "")}
              </Cell>
              <Cell className={`flex-initial ${INDICATION_WIDTH}`}>
                {rowIndication[0] ?? ""}
              </Cell>
              {posologies.map((posologie) => (
                <Cell
                  key={`cell_${medicamentId}_${posologie}`}
                  className={`flex-initial ${POSOLOGIE_WIDTH} ${
                    PLAN_POSOLOGIE_COLOR?.[posologie as "poso_matin"]?.body
                  } p-0`}
                >
                  {rowData?.posologies?.[posologie] ?? ""}
                </Cell>
              ))}
              <Cell alignLeft>
                {[...rowCommentaires, ...rowCustomCommentaires]}
              </Cell>
            </Row>
          </Table>
        );
      })}
      {precautions.map((precaution) => (
        <View
          key={precaution.id}
          style={[
            tw("rounded-lg border p-4 mt-4"),
            { borderColor: precaution.couleur },
          ]}
          wrap={false}
        >
          <Text style={[tw("text-sm"), { fontFamily: "Helvetica-Bold" }]}>
            {precaution.titre}
          </Text>
          <Html
            style={tw("text-sm")}
            stylesheet={{
              p: {
                marginVertical: 0,
              },
              ul: {
                marginVertical: 0,
                width: "95%",
              },
              ol: {
                marginVertical: 0,
                width: "95%",
              },
            }}
          >
            {precaution.contenu}
          </Html>
        </View>
      ))}
    </CommonPdf>
  );
};

export default PrintPDF;
