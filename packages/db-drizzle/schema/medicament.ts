import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const medicaments = mysqlTable(
  "medicaments",
  {
    id: varchar("id", { length: 191 }).notNull(),
    denomination: varchar("denomination", { length: 191 }).notNull(),
    indications: json("indications").notNull(),
    conservationFrigo: tinyint("conservationFrigo").notNull(),
    conservationDuree: json("conservationDuree"),
    voiesAdministration: json("voiesAdministration").notNull(),
    medicsSimpleId: int("medics_simpleId").notNull(),
    precautionId: int("precautionId"),
    precautionOld: varchar("precaution_old", { length: 191 }),
  },
  (table) => {
    return {
      medicsSimpleIdIdx: index("medicaments_medics_simpleId_idx").on(
        table.medicsSimpleId,
      ),
      precautionIdIdx: index("medicaments_precautionId_idx").on(
        table.precautionId,
      ),
      medicamentsId: primaryKey(table.id),
      medicamentsDenominationKey: unique("medicaments_denomination_key").on(
        table.denomination,
      ),
    };
  },
);

export const commentaires = mysqlTable(
  "commentaires",
  {
    id: varchar("id", { length: 191 }).notNull(),
    voieAdministration: mysqlEnum("voieAdministration", [
      "ORALE",
      "CUTANEE",
      "AURICULAIRE",
      "NASALE",
      "INHALEE",
      "VAGINALE",
      "OCULAIRE",
      "RECTALE",
      "SOUS_CUTANEE",
      "INTRA_MUSCULAIRE",
      "INTRA_VEINEUX",
      "INTRA_URETRALE",
      "AUTRE",
    ]),
    population: varchar("population", { length: 191 }),
    texte: text("texte").notNull(),
    medicamentId: varchar("medicamentId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      medicamentIdIdx: index("commentaires_medicamentId_idx").on(
        table.medicamentId,
      ),
      commentairesId: primaryKey(table.id),
    };
  },
);

export const principesActifs = mysqlTable(
  "principes_actifs",
  {
    id: varchar("id", { length: 191 }).notNull(),
    denomination: varchar("denomination", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      principesActifsId: primaryKey(table.id),
      principesActifsDenominationKey: unique(
        "principes_actifs_denomination_key",
      ).on(table.denomination),
    };
  },
);

export const medicamentToPrincipeActif = mysqlTable(
  "_MedicamentToPrincipeActif",
  {
    a: varchar("A", { length: 191 }).notNull(),
    b: varchar("B", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      bIdx: index("_MedicamentToPrincipeActif_B_index").on(table.b),
      medicamentToPrincipeActifAbUnique: unique(
        "_MedicamentToPrincipeActif_AB_unique",
      ).on(table.a, table.b),
    };
  },
);

export const precautions = mysqlTable(
  "precautions",
  {
    id: int("id").autoincrement().notNull(),
    motCle: varchar("mot_cle", { length: 50 }).notNull(),
    titre: varchar("titre", { length: 200 }).notNull(),
    contenu: text("contenu").notNull(),
    couleur: varchar("couleur", { length: 10 }).notNull(),
  },
  (table) => {
    return {
      precautionsId: primaryKey(table.id),
      precautionsMotCleKey: unique("precautions_mot_cle_key").on(table.motCle),
    };
  },
);

export const medicsSimple = mysqlTable(
  "medics_simple",
  {
    id: int("id").autoincrement().notNull(),
    nomMedicament: varchar("nomMedicament", { length: 200 }),
    nomGenerique: varchar("nomGenerique", { length: 100 }),
    indication: text("indication"),
    frigo: tinyint("frigo").default(0).notNull(),
    dureeConservation: text("dureeConservation"),
    voieAdministration: varchar("voieAdministration", { length: 50 }),
    matin: varchar("matin", { length: 20 }),
    midi: varchar("midi", { length: 20 }),
    soir: varchar("soir", { length: 20 }),
    coucher: varchar("coucher", { length: 20 }),
    commentaire: text("commentaire"),
    modifie: varchar("modifie", { length: 20 }).default("NOW()"),
    precaution: varchar("precaution", { length: 50 }),
    qui: varchar("qui", { length: 10 }),
    relecture: int("relecture").default(0),
    stat: int("stat").default(0).notNull(),
  },
  (table) => {
    return {
      medicsSimpleId: primaryKey(table.id),
    };
  },
);
