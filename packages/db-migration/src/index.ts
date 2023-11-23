import prisma from "@plan-prise/db-prisma";
import {
  migrateCalendars,
  migrateMedics,
  migratePlans,
  migratePrecautions,
  migrateUsers,
} from "@plan-prise/db-prisma/migration/1-migrate-old-db";
import migrateMedicsNew from "@plan-prise/db-prisma/migration/2-migrate-medics-new";
import { migratePlanNew } from "@plan-prise/db-prisma/migration/3-migrate-plans";
import { addMaxIdColumn } from "@plan-prise/db-prisma/migration/4-add-maxid-column-users";
import { migrateRenamePrecautions } from "@plan-prise/db-prisma/migration/5-rename-precautions";
import { migrateMedicamentPrecautions } from "@plan-prise/db-prisma/migration/6-migrate-precautions";

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
    case "4":
      await addMaxIdColumn();
      process.exit();
    case "5":
      await migrateRenamePrecautions();
      process.exit();
    case "6":
      await migrateMedicamentPrecautions();
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
