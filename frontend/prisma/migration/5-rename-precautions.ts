import prisma from "@/prisma";
import { Prisma } from "@prisma/client";

export const migrateRenamePrecautions = async () => {
  await prisma.$executeRaw(
    Prisma.sql`ALTER TABLE precautions_old RENAME precautions`,
  );
  await prisma.$executeRaw(
    Prisma.sql`ALTER TABLE medicaments RENAME COLUMN precaution TO precaution_old;`,
  );
};

// TODO: then db push
