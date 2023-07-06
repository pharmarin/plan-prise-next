import prisma from "@/prisma";
import {
  migrateCalendars,
  migrateMedics,
  migratePlans,
  migratePrecautions,
  migrateUsers,
} from "@/prisma/migration/1-migrate-old-db";
import migrateMedicsNew from "@/prisma/migration/2-migrate-medics-new";
import { migratePlanNew } from "@/prisma/migration/3-migrate-plans";

const seeder = async () => {
  switch (process.argv?.[2]) {
    case "1":
      const users = await migrateUsers();
      await migrateMedics();
      await migratePrecautions();
      await migrateCalendars(users);
      await migratePlans(users);
      process.exit();
    case "2":
      await migrateMedicsNew();
      process.exit();
    case "3":
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
