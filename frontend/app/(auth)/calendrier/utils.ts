import { format } from "date-fns";

export const toYYYYMMDD = (date: Date) => format(date, "yyyy-MM-dd");
