export type CalendarsTable = {
  type: "table";
  name: "calendriers";
  database: DatabaseName;
  data: {
    id: number;
    user: number;
    data: string;
    TIME: string;
  }[];
};

export type MedicsTable = {
  type: "table";
  name: "medics_simple";
  database: DatabaseName;
  data: {
    id: number;
    nomMedicament: string;
    nomGenerique?: string;
    indication?: string;
    frigo: string;
    dureeConservation: string;
    voieAdministration?: string;
    matin?: string;
    midi?: string;
    soir?: string;
    coucher?: string;
    commentaire?: string;
    modifie?: string;
    precaution?: string;
    qui?: string;
    relecture?: number;
    stat: number;
  }[];
};

export type PlansTable = {
  type: "table";
  name: "plans";
  database: DatabaseName;
  data: {
    id: number;
    user: number;
    data: string;
    options: string;
    TIME: string;
  }[];
};

export type PrecautionsTable = {
  type: "table";
  name: "precautions";
  database: DatabaseName;
  data: {
    id: number;
    mot_cle: string;
    titre: string;
    contenu: string;
    couleur: string;
  }[];
};

export type UsersTable = {
  type: "table";
  name: "users";
  database: DatabaseName;
  data: {
    Id: number;
    admin: string;
    login: string;
    password: string;
    fullname: string;
    active: string;
    mail: string;
    resetToken: string;
    reset: string;
    rpps: string;
    status: string;
    inscription: string;
  }[];
};

export type MySQLExport<DatabaseName = "plandepr_medics"> = (
  | { type: "header"; version: string; comment: string }
  | { type: "database"; name: DatabaseName }
  | CalendarsTable
  | MedicsTable
  | PlansTable
  | PrecautionsTable
  | UsersTable
)[];
