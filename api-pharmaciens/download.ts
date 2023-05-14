import { createWriteStream } from "fs";
import { Agent } from "https";
import fetch from "node-fetch";
import { ParseOne } from "unzipper";

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

fetch(
  "https://service.annuaire.sante.fr/annuaire-sante-webservices/V300/services/extraction/Porteurs_CPS_CPF",
  { agent: httpsAgent }
).then(
  async (response) =>
    response.body
      .pipe(ParseOne())
      .pipe(createWriteStream("data/practitionners.txt"))
  /* await writeFile(
      path.join('data', 'Porteurs_CPS_CPF.txt'),
      new TextDecoder('iso-8859-1').decode(await response.arrayBuffer())
    ) */
);
