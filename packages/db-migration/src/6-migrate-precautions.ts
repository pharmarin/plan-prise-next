import prisma from "@plan-prise/db-prisma";

export const migrateMedicamentPrecautions = async () => {
  const precautions = await prisma.precaution.findMany();

  await Promise.all(
    precautions.map((precaution) =>
      prisma.medicament.updateMany({
        where: { precaution_old: precaution.mot_cle },
        data: { precautionId: precaution.id },
      }),
    ),
  );
};
