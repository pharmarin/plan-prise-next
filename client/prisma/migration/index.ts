import prisma from "../index";
import type {
  CalendarsTable,
  MedicsTable,
  MySQLExport,
  PlansTable,
  PrecautionsTable,
  UsersTable,
} from "./database";
import database from "./plandepr_medics.json";

const usersMapCache: { [email: string]: { username: string; newId: string } } =
  {};
let usersMap: { [username: string]: string };

const seeder = async () => {
  const usersTable =
    (database as MySQLExport).find(
      (data): data is UsersTable =>
        data.type === "table" && data.name === "users"
    )?.data || [];

  await prisma.user.createMany({
    data: usersTable.map((user) => {
      usersMapCache[user.mail] = { username: user.login, newId: "" };

      return {
        admin: user.admin === "1",
        displayName: user.fullname,
        student: user.status === "2",
        rpps: Number(user.rpps),
        email: user.mail,
        password: user.password,
        createdAt: new Date(user.inscription),
        approvedAt: user.active === "1" ? new Date(user.inscription) : null,
      };
    }),
  });

  (
    await prisma.user.findMany({
      select: { id: true, email: true },
    })
  ).map((user) => {
    usersMapCache[user.email].newId = user.id;
  });

  usersMap = Object.fromEntries(
    Object.values(usersMapCache).map((value) => [value.username, value.newId])
  );

  const medicsTable =
    (database as MySQLExport).find(
      (data): data is MedicsTable =>
        data.type === "table" && data.name === "medics_simple"
    )?.data || [];

  await prisma.medics_simple.createMany({
    data: medicsTable.map(({ id: _id, ...medic }) => ({
      nomMedicament: medic.nomMedicament,
      nomGenerique: medic.nomGenerique || null,
      indication: medic.indication || null,
      frigo: medic.frigo === "1",
      dureeConservation: medic.dureeConservation || null,
      voieAdministration: medic.voieAdministration || null,
      commentaire: medic.commentaire || null,
      precaution: medic.precaution || null,
    })),
  });

  const precautionsTable =
    (database as MySQLExport).find(
      (data): data is PrecautionsTable =>
        data.type === "table" && data.name === "precautions"
    )?.data || [];

  await prisma.precautions_old.createMany({
    data: precautionsTable.map(({ id: _id, ...precaution }) => precaution),
  });

  const calendarsTable =
    (database as MySQLExport).find(
      (data): data is CalendarsTable =>
        data.type === "table" && data.name === "calendriers"
    )?.data || [];

  await prisma.calendriers_old.createMany({
    data: calendarsTable.map(({ id: _id, ...calendar }) => ({
      ...calendar,
      user: usersMap[calendar.user] || "",
      TIME: new Date(calendar.TIME),
    })),
  });

  const plansTable =
    (database as MySQLExport).find(
      (data): data is PlansTable =>
        data.type === "table" && data.name === "plans"
    )?.data || [];

  await prisma.plans_old.createMany({
    data: plansTable.map(({ id: _id, ...plan }) => ({
      ...plan,
      user: usersMap[plan.user] || "",
      TIME: new Date(plan.TIME),
    })),
  });
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
