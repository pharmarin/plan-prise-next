import type { Commentaire, Medicament, PrincipeActif } from "@prisma/client";

export type MedicamentIdentifier = {
  id: Medicament["id"];
  denomination: Medicament["denomination"];
};

export type MedicamentInclude = Medicament & {
  commentaires: Commentaire[];
  principesActifs: PrincipeActif[];
};

export type MedicamentConservationDuree = {
  laboratoire?: string;
  duree: string;
}[];
