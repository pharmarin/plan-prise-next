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

type UsersMap = Record<string, string>;

export const migrateUsers = async (): Promise<UsersMap> => {
  console.log(
    "Migration n°1 : Migration de l'export de la base de données vers Planetscale",
  );

  const usersMap: Record<string, { username: string; newId: string }> = {};

  const usersTable =
    (database as MySQLExport).find(
      (data): data is UsersTable =>
        data.type === "table" && data.name === "users",
    )?.data || [];

  console.log(
    "Migration de la table 'users' en cours, %d utilisateurs à migrer",
    usersTable.length,
  );

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

  console.log("Migration de la table 'users' terminée");

  (
    await prisma.user.findMany({
      select: { id: true, email: true },
    })
  ).map((user) => {
    usersMap[user.email].newId = user.id;
  });

  return Object.fromEntries(
    Object.values(usersMap).map((value) => [value.username, value.newId]),
  );
};

export const migratePrecautions = async () => {
  const precautionsTable =
    (database as MySQLExport).find(
      (data): data is PrecautionsTable =>
        data.type === "table" && data.name === "precautions",
    )?.data || [];

  console.log(
    "Migration de la table 'precautions' en cours, %d utilisateurs à migrer",
    precautionsTable.length,
  );

  await prisma.precautions_old.createMany({
    data: precautionsTable.map(({ id: _id, ...precaution }) => precaution),
  });

  console.log("Migration de la table 'precautions' terminée");
};

export const migrateMedics = async () => {
  const medicsTable =
    (database as MySQLExport).find(
      (data): data is MedicsTable =>
        data.type === "table" && data.name === "medics_simple",
    )?.data || [];

  console.log(
    "Migration de la table 'medics' en cours, %d utilisateurs à migrer",
    medicsTable.length,
  );

  await prisma.medics_simple.createMany({
    data: medicsTable.map((medic) => {
      //console.log(medic.commentaire);

      return {
        id: Number(medic.id),
        nomMedicament: medic.nomMedicament,
        nomGenerique: medic.nomGenerique || null,
        indication: medic.indication || null,
        frigo: medic.frigo === "1",
        dureeConservation: medic.dureeConservation || null,
        voieAdministration: medic.voieAdministration || null,
        commentaire: medic.commentaire
          ? JSON.stringify(
              JSON.parse(
                (medic.commentaire.startsWith("[")
                  ? medic.commentaire
                  : `[${medic.commentaire}]`
                ).replaceAll("\\'", "'"),
              ),
            )
          : null,
        precaution: medic.precaution || null,
      };
    }),
  });

  console.log("Migration de la table 'medics' terminée");
};

export const migrateCalendars = async (users: UsersMap) => {
  const calendarsTable =
    (database as MySQLExport).find(
      (data): data is CalendarsTable =>
        data.type === "table" && data.name === "calendriers",
    )?.data || [];

  console.log(
    "Migration de la table 'calendars' en cours, %d utilisateurs à migrer",
    calendarsTable.length,
  );

  await prisma.calendriers_old.createMany({
    data: calendarsTable.map(({ id: _id, ...calendar }) => ({
      ...calendar,
      user: users[calendar.user] || "",
      TIME: new Date(calendar.TIME),
    })),
  });

  console.log("Migration de la table 'calendars' terminée");
};

export const migratePlans = async (users: UsersMap) => {
  const plansTable =
    (database as MySQLExport).find(
      (data): data is PlansTable =>
        data.type === "table" && data.name === "plans",
    )?.data || [];

  console.log(
    "Migration de la table 'plans' en cours, %d utilisateurs à migrer",
    plansTable.length,
  );

  await prisma.plans_old.createMany({
    data: plansTable.map(({ id: _id, ...plan }) => ({
      ...plan,
      user: users[plan.user] || "",
      TIME: new Date(plan.TIME),
    })),
  });

  console.log("Migration de la table 'plans' terminée");
};
