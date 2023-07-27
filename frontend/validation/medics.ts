import * as z from "zod";

export const medicId = z.string().cuid();
