import { Prisma } from "@prisma/client";

import prisma from "@plan-prise/db-prisma";

export const migrateRenamePrecautions = async () => {
  await prisma.$executeRaw(
    Prisma.sql`ALTER TABLE precautions_old RENAME precautions`,
  );
};

// TODO: then db push
