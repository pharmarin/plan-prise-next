import prisma from "@/prisma";
import { SingleBar } from "cli-progress";

export const addMaxIdColumn = async () => {
  console.log("Migration n°4 : Ajout d'une colonne maxId au modèle User");

  const users = await prisma.user.findMany();

  console.log("Migration en cours, %d utilisateurs à traiter", users.length);

  const progressBar = new SingleBar({});

  progressBar.start(users.length, 0);

  for (const user of users) {
    const maxId = await prisma.plans_old.aggregate({
      _max: { id: true },
      where: { user: user.id },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { maxId: maxId._max.id || undefined },
    });

    progressBar.increment();
  }
};
