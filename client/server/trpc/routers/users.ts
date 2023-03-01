import { requireIdSchema } from "common/validation/users";
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
  /**
   * Get all users
   *
   * @argument {never}
   *
   * @returns {User[]} Users
   */
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
  /**
   * Approves user
   *
   * @argument {string} id
   *
   * @returns {User & { password: never }} Updated user
   */
  approve: adminProcedure
    .input(requireIdSchema)
    .mutation(async ({ ctx, input }) =>
      exclude(
        await ctx.prisma.user.update({
          where: { id: input },
          data: { approvedAt: new Date() },
        }),
        ["password"]
      )
    ),
  /**
   * Count users
   *
   * @argument {never}
   *
   * @returns {number} User count
   */
  count: adminProcedure.query(async ({ ctx }) => await ctx.prisma.user.count()),
  /**
   * Delete user
   *
   * @argument {string} User id
   *
   * @returns {undefined}
   */
  delete: adminProcedure
    .input(requireIdSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input } });
    }),
  /**
   * Get unique user
   *
   * @argument {string} User id
   *
   * @returns {User} Found user
   * @throws If not found
   */
  unique: adminProcedure.input(requireIdSchema).query(async ({ ctx, input }) =>
    exclude(
      await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input },
      }),
      ["password"]
    )
  ),
});

export default usersRouter;
