import type { Medicament } from "@plan-prise/db-prisma";
import prisma from "@plan-prise/db-prisma";

export const fixConservationDuree = async () => {
  const problems: Medicament[] =
    await prisma.$queryRaw`SELECT * FROM medicaments WHERE conservationDuree LIKE '%[{"duree": {"%' ORDER BY id LIMIT 300 OFFSET 0;`;

  console.log(`${problems.length} problems found`);

  for (const problem of problems) {
    console.log(`Processing ${problem.denomination}`);

    const oldConservation = problem.conservationDuree as unknown as [
      {
        duree: Record<string, string>;
        laboratoire: "0";
      },
    ];

    const newConservation: PP.Medicament.ConservationDuree = Object.entries(
      oldConservation[0].duree,
    ).map(([laboratoire, duree]) => ({ duree, laboratoire }));

    await prisma.medicament.update({
      where: { id: problem.id },
      data: { conservationDuree: newConservation },
    });
  }
};
