import { parse } from "csv-parse";
import { writeFile } from "fs/promises";
import { Agent } from "https";
import fetch from "node-fetch";
import { ParseOne } from "unzipper";

type CSVRecord = {
  rpps: string;
  lastName: string;
  firstName: string;
  profession: string;
};

export type ParsedRecord = {
  rpps: number;
  lastName: string;
  firstName: string;
};

const allowedHeader = {
  "Identifiant PP": "rpps",
  "Nom d'exercice": "lastName",
  "Prénom d'exercice": "firstName",
  "Code profession": "profession",
};

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const parser = parse({
  delimiter: "|",
  columns: (header: string[]) =>
    header.map((column) =>
      Object.keys(allowedHeader).includes(column)
        ? allowedHeader[column]
        : undefined
    ),
});

fetch(
  "https://service.annuaire.sante.fr/annuaire-sante-webservices/V300/services/extraction/Porteurs_CPS_CPF",
  { agent: httpsAgent }
).then(async (response) => {
  const jsonArray: ParsedRecord[] = await new Promise((resolve, reject) => {
    const records: ParsedRecord[] = [];

    response.body
      .pipe(ParseOne())
      .pipe(parser)
      .on("error", (reason) => {
        console.log("rejected: ", reason);
        reject();
      })
      .on("readable", function () {
        let record: CSVRecord;
        while ((record = parser.read()) !== null) {
          if (record.profession === "21") {
            records.push({
              firstName: record.firstName,
              lastName: record.lastName,
              rpps: Number(record.rpps),
            });
          }
        }
      })
      .on("end", () => resolve(records));
  });

  await writeFile("data/practitionners.json", JSON.stringify(jsonArray));
});
