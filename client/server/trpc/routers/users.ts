import { approveUserSchema, queryUserSchema } from "common/validation/users";
import { adminProcedure, router } from "server/trpc/trpc";

const exclude = <User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> => {
  for (let key of keys) {
    delete user[key];
  }
  return user;
};

const usersRouter = router({
  approve: adminProcedure.input(approveUserSchema).mutation(
    async ({ ctx, input }) =>
      await ctx.prisma.user.update({
        where: { id: input },
        data: { approvedAt: new Date() },
      })
  ),
  all: adminProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.user.findMany({
        select: {
          id: true,
          lastName: true,
          firstName: true,
          student: true,
          admin: true,
          rpps: true,
          createdAt: true,
          approvedAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
  ),
  count: adminProcedure.query(async ({ ctx }) => await ctx.prisma.user.count()),
  unique: adminProcedure.input(queryUserSchema).query(async ({ ctx, input }) =>
    exclude(
      await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input },
      }),
      ["password"]
    )
  ),
});

export default usersRouter;
