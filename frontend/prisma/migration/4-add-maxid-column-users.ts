import prisma from "@/prisma";

export const addMaxIdColumn = async () => {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const maxId = await prisma.plans_old.aggregate({
      _max: { id: true },
      where: { user: user.id },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { maxId: maxId._max.id || undefined },
    });
  }
};
