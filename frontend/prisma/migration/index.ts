import prisma from "@/prisma";
import { migratePlanNew } from "@/prisma/migration/migrate-models";
import {
  migrateCalendars,
  migrateMedics,
  migratePlans,
  migratePrecautions,
  migrateUsers,
} from "@/prisma/migration/migrate-old-db";

const seeder = async () => {
  switch (process.argv?.[2]) {
    case "all":
      const users = await migrateUsers();
      await migrateMedics();
      await migratePrecautions();
      await migrateCalendars(users);
      await migratePlans(users);
      process.exit();
    case "medics":
      await migrateMedics();
      process.exit();
    case "plan-new":
      await migratePlanNew();
      process.exit();
    default:
      console.info("Vous devez fournir au moins un argument");
      process.exit(1);
  }
};

seeder()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
