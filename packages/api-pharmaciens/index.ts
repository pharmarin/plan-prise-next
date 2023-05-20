import { readFile } from "fs/promises";
import { ParsedRecord } from "./download";

const loadData = async () => {
  const file = await readFile(
    new URL("./data/practitionners.json", import.meta.url)
  );
  return JSON.parse(file.toString()) as ParsedRecord[];
};

export const findOne = async (rpps: number) => {
  const data = await loadData();

  return data.find((practitionner) => practitionner.rpps === rpps);
};
