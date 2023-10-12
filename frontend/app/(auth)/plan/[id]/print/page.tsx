import PlanPrintClient from "@/app/(auth)/plan/[id]/print/client";
import { PLAN_SETTINGS_DEFAULT } from "@/app/(auth)/plan/_lib/constants";
import { parseData } from "@/app/(auth)/plan/_lib/functions";
import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { PlanPrisePosologies } from "@/types/plan";
import { merge } from "lodash";
import { notFound } from "next/navigation";

const PlanPrint = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { displayName: true, lastName: true, firstName: true },
  });

  const plan = await prisma.plan.findFirst({
    where: { displayId: Number(params.id), user: { id: session?.user.id } },
    include: {
      medics: {
        include: { commentaires: true, principesActifs: true },
      },
    },
  });

  if (!plan || !user) {
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
    <PlanPrintClient
      plan={plan}
      planData={planData}
      planMedicsOrder={planMedicsOrder}
      planPosologies={planPosologies}
      user={user}
    />
  );
};

export default PlanPrint;
