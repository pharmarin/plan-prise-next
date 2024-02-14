import { fixConservationDuree } from "@/6-fix-conservation-duree";

import prisma from "@plan-prise/db-prisma";

import {
  migrateCalendars,
  migrateMedics,
  migratePlans,
  migratePrecautions,
  migrateUsers,
} from "./1-migrate-old-db";
import migrateMedicsNew from "./2-migrate-medics-new";
import { migratePlanNew } from "./3-migrate-plans";
import { addMaxIdColumn } from "./4-add-maxid-column-users";
import { migrateRenamePrecautions } from "./5-rename-precautions";

const seeder = async () => {
  switch (process.argv?.[2]) {
    case "1": {
      const users = await migrateUsers();
      await migrateMedics();
      await migratePrecautions();
      await migrateCalendars(users);
      await migratePlans(users);
      process.exit();
      break;
    }
    case "2":
      await migrateMedicsNew();
      process.exit();
      break;
    case "3":
      await migratePlanNew();
      process.exit();
      break;
    case "4":
      await addMaxIdColumn();
      process.exit();
      break;
    case "5":
      await migrateRenamePrecautions();
      process.exit();
      break;
    case "6":
      await fixConservationDuree();
      process.exit();
      break;
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
