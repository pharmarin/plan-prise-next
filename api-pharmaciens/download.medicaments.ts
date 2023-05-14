import { writeFile } from 'fs/promises';
import path = require('path');

const files = [
  'CIS_bdpm.txt',
  'CIS_CIP_bdpm.txt',
  'CIS_COMPO_bdpm.txt',
  'CIS_HAS_SMR_bdpm.txt',
  'CIS_HAS_ASMR_bdpm.txt',
  'HAS_LiensPageCT_bdpm.txt',
  'CIS_GENER_bdpm.txt',
  'CIS_CPD_bdpm.txt',
];

files.forEach((file) => {
  fetch(
    'http://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=' +
      file
  ).then(
    async (response) =>
      await writeFile(
        path.join(__dirname, '/data/', file),
        new TextDecoder('iso-8859-1').decode(await response.arrayBuffer())
      )
  );
});
