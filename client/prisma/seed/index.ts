import prisma from "@/prisma/client";
import { type MySQLExport } from "@/prisma/seed/database";
import database from "@/prisma/seed/plandepr_medics.json";

const seeder = async () => {
  await Promise.all(
    (database as MySQLExport).map(async (data) => {
      if (data.type === "table") {
        if (data.name === "users") {
          await prisma.user.createMany({
            data: data.data.map((user) => ({
              admin: user.admin === "1",
              displayName: user.fullname,
              student: user.status === "2",
              rpps: Number(user.rpps),
              email: user.mail,
              password: user.password,
              createdAt: new Date(user.inscription),
              approvedAt:
                user.active === "1" ? new Date(user.inscription) : null,
            })),
          });
        }
      }
    })
  );
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
