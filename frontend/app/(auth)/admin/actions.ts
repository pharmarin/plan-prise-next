"use server";

import { revalidatePath as $revalidatePath } from "next/cache";

export const revalidatePath = async (path: string) =>
  Promise.resolve($revalidatePath(path));
