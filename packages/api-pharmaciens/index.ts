import practitionners from "./data/practitionners.json";
import { ParsedRecord } from "./download";

const loadData = () => {
  return practitionners as ParsedRecord[];
};

export const findOne = (rpps: number) => {
  const data = loadData();

  return data.find((practitionner) => practitionner.rpps === rpps);
};
