import { User } from "@prisma/client";
import { getUpdateUserSchema, requireIdSchema } from "common/validation/users";
import { adminProcedure, authProcedure, router } from "server/trpc/trpc";

const exclude = <User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> => {
  for (let key of keys) {
    delete user[key];
  }
  return user;
};

const excludePassword = <User extends { password?: string }>(
  user: User
): Omit<User, "password"> => exclude(user, ["password"]);

type UserSafe = Partial<User> & { password?: never };

const usersRouter = router({
  /**
   * Get all users
   *
   * @argument {never}
   *
   * @returns {UserSafe[]} Users
   */
  all: adminProcedure.query(
    async ({ ctx }): Promise<UserSafe[]> =>
      await ctx.prisma.user.findMany({
        select: {
          id: true,
          lastName: true,
          firstName: true,
          displayName: true,
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
   * @returns {UserSafe} Updated user
   */
  approve: adminProcedure.input(requireIdSchema).mutation(
    async ({ ctx, input }): Promise<UserSafe> =>
      excludePassword(
        await ctx.prisma.user.update({
          where: { id: input },
          data: { approvedAt: new Date() },
        })
      )
  ),
  /**
   * Count users
   *
   * @argument {void}
   *
   * @returns {number} User count
   */
  count: adminProcedure.query(async ({ ctx }) => await ctx.prisma.user.count()),
  /**
   * Get current logged in user details
   *
   * @argument {void} (Uses user id stored in JWT/session)
   *
   * @returns {UserSafe}
   */
  current: authProcedure.query(
    async ({ ctx }): Promise<UserSafe> =>
      excludePassword(
        await ctx.prisma.user.findUniqueOrThrow({
          where: { id: ctx.user.id },
        })
      )
  ),
  /**
   * Delete user
   *
   * @argument {string} id User id
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
   * @argument {string} id User id
   *
   * @returns {UserSafe} Found user
   * @throws If not found
   */
  unique: adminProcedure.input(requireIdSchema).query(
    async ({ ctx, input }): Promise<UserSafe> =>
      excludePassword(
        await ctx.prisma.user.findUniqueOrThrow({
          where: { id: input },
        })
      )
  ),
  /**
   * Updates user
   *
   * @argument {Partial<UserSafe>} input EditInformations values
   */
  update: authProcedure.input(getUpdateUserSchema(true)).mutation(
    async ({ ctx, input: { id, ...values } }): Promise<UserSafe> =>
      excludePassword(
        await ctx.prisma.user.update({
          where: { id },
          data: {
            ...values,
            rpps: values.rpps ? BigInt(values.rpps) : undefined,
          },
        })
      )
  ),
});

export default usersRouter;
