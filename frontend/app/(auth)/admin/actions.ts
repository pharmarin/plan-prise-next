"use server";

import { revalidatePath as $revalidatePath } from "next/cache";

export const revalidatePath = (path: string) => {
  $revalidatePath(path);
};
