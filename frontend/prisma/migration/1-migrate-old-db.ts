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

type UsersMap = { [username: string]: string };

export const migrateUsers = async (): Promise<UsersMap> => {
  const usersMap: {
    [email: string]: { username: string; newId: string };
  } = {};

  const usersTable =
    (database as MySQLExport).find(
      (data): data is UsersTable =>
        data.type === "table" && data.name === "users"
    )?.data || [];

  await prisma.user.createMany({
    data: usersTable.map((user) => {
      usersMap[user.mail] = { username: user.login, newId: "" };

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
    usersMap[user.email].newId = user.id;
  });

  return Object.fromEntries(
    Object.values(usersMap).map((value) => [value.username, value.newId])
  );
};

export const migratePrecautions = async () => {
  const precautionsTable =
    (database as MySQLExport).find(
      (data): data is PrecautionsTable =>
        data.type === "table" && data.name === "precautions"
    )?.data || [];

  await prisma.precautions_old.createMany({
    data: precautionsTable.map(({ id: _id, ...precaution }) => precaution),
  });
};

export const migrateMedics = async () => {
  const medicsTable =
    (database as MySQLExport).find(
      (data): data is MedicsTable =>
        data.type === "table" && data.name === "medics_simple"
    )?.data || [];

  await prisma.medics_simple.createMany({
    data: medicsTable.map((medic) => {
      console.log(medic.commentaire);

      return {
        id: Number(medic.id),
        nomMedicament: medic.nomMedicament,
        nomGenerique: medic.nomGenerique || null,
        indication: medic.indication || null,
        frigo: medic.frigo === "1",
        dureeConservation: medic.dureeConservation || null,
        voieAdministration: medic.voieAdministration || null,
        commentaire: medic.commentaire ? JSON.parse(medic.commentaire) : null,
        precaution: medic.precaution || null,
      };
    }),
  });
};

export const migrateCalendars = async (users: UsersMap) => {
  const calendarsTable =
    (database as MySQLExport).find(
      (data): data is CalendarsTable =>
        data.type === "table" && data.name === "calendriers"
    )?.data || [];

  await prisma.calendriers_old.createMany({
    data: calendarsTable.map(({ id: _id, ...calendar }) => ({
      ...calendar,
      user: users[calendar.user] || "",
      TIME: new Date(calendar.TIME),
    })),
  });
};

export const migratePlans = async (users: UsersMap) => {
  const plansTable =
    (database as MySQLExport).find(
      (data): data is PlansTable =>
        data.type === "table" && data.name === "plans"
    )?.data || [];

  await prisma.plans_old.createMany({
    data: plansTable.map(({ id: _id, ...plan }) => ({
      ...plan,
      user: users[plan.user] || "",
      TIME: new Date(plan.TIME),
    })),
  });
};
