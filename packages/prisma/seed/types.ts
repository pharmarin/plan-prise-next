export type MySQLExport<DatabaseName = "plandepr_medics"> = (
  | { type: "header"; version: string; comment: string }
  | { type: "database"; name: DatabaseName }
  | {
      type: "table";
      name: "calendriers";
      database: DatabaseName;
      data: {
        id: string;
        user: string;
        data: string;
        TIME: string;
      }[];
    }
  | {
      type: "table";
      name: "medics_simple";
      database: DatabaseName;
      data: {
        id: string;
        nomMedicament?: string;
        nomGenerique?: string;
        indication?: string;
        frigo: string;
        dureeConservation?: string;
        voieAdministration?: string;
        matin?: string;
        midi?: string;
        soir?: string;
        coucher?: string;
        commentaire?: string;
        modifie?: string;
        precaution?: string;
        qui?: string;
        relecture?: string;
        stat: string;
      }[];
    }
  | {
      type: "table";
      name: "plans";
      database: DatabaseName;
      data: {
        id: string;
        user: string;
        data: string;
        options: string;
        TIME: string;
      }[];
    }
  | {
      type: "table";
      name: "precautions";
      database: DatabaseName;
      data: {
        id: string;
        mot_cle: string;
        titre: string;
        contenu: string;
        couleur: string;
      }[];
    }
  | {
      type: "table";
      name: "users";
      database: DatabaseName;
      data: {
        Id: string;
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
    }
)[];
