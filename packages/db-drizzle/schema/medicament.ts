import { relations } from "drizzle-orm";
import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

export const medicaments = mysqlTable("medicaments", {
  id: varchar("id", { length: 191 }).primaryKey(),
  denomination: varchar("denomination", { length: 191 }).notNull().unique(),
  indications: json("indications").notNull(),
  conservationFrigo: tinyint("conservationFrigo").notNull(),
  conservationDuree: json("conservationDuree"),
  voiesAdministration: json("voiesAdministration").notNull(),
  medicsSimpleId: int("medics_simpleId").notNull(),
  precautionId: int("precautionId"),
  precautionOld: varchar("precaution_old", { length: 191 }),
});

export const medicamentsRelations = relations(medicaments, ({ one, many }) => ({
  commentaires: many(commentaires),
  medicSimple: one(medicsSimple, {
    fields: [medicaments.medicsSimpleId],
    references: [medicsSimple.id],
  }),
  precautionId: one(precautions, {
    fields: [medicaments.precautionId],
    references: [precautions.id],
  }),
  medicamentToPrincipeActif: many(medicamentToPrincipeActif),
}));

const voiesAdministration = mysqlEnum("voieAdministration", [
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
]);

export const commentaires = mysqlTable("commentaires", {
  id: varchar("id", { length: 191 }).primaryKey(),
  voieAdministration: voiesAdministration,
  population: varchar("population", { length: 191 }),
  texte: text("texte").notNull(),
  medicamentId: varchar("medicamentId", { length: 191 }).notNull(),
});

export const commentairesRelations = relations(commentaires, ({ one }) => ({
  medicament: one(medicaments, {
    fields: [commentaires.medicamentId],
    references: [medicaments.id],
  }),
}));

export const principesActifs = mysqlTable("principes_actifs", {
  id: varchar("id", { length: 191 }).primaryKey(),
  denomination: varchar("denomination", { length: 191 }).notNull().unique(),
});

export const principesActifsRelations = relations(
  principesActifs,
  ({ many }) => ({
    medicamentToPrincipeActif: many(medicamentToPrincipeActif),
  }),
);

export const medicamentToPrincipeActif = mysqlTable(
  "_MedicamentToPrincipeActif",
  {
    medicament: varchar("A", { length: 191 })
      .notNull()
      .references(() => medicaments.id),
    principeActif: varchar("B", { length: 191 })
      .notNull()
      .references(() => principesActifs.id),
  },
);

export const medicamentToPrincipeActifRelations = relations(
  medicamentToPrincipeActif,
  ({ one }) => ({
    medicament: one(medicaments, {
      fields: [medicamentToPrincipeActif.medicament],
      references: [medicaments.id],
    }),
    principeActif: one(principesActifs, {
      fields: [medicamentToPrincipeActif.principeActif],
      references: [principesActifs.id],
    }),
  }),
);

export const precautions = mysqlTable("precautions", {
  id: int("id").autoincrement().primaryKey(),
  motCle: varchar("mot_cle", { length: 50 }).notNull().unique(),
  titre: varchar("titre", { length: 200 }).notNull(),
  contenu: text("contenu").notNull(),
  couleur: varchar("couleur", { length: 10 }).notNull(),
});

export const precautionsRelations = relations(precautions, ({ many }) => ({
  medicaments: many(medicaments),
}));

export const medicsSimple = mysqlTable("medics_simple", {
  id: int("id").autoincrement().primaryKey(),
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
});
