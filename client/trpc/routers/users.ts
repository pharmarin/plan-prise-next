import {
  getUpdateUserSchema,
  requireIdSchema,
  updateUserPasswordSchema,
} from "@/common/validation/users";
import { adminProcedure, authProcedure, router } from "@/trpc/trpc";
import PP_Error from "@/utils/errors";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

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
   * @returns {User} Updated user
   */
  approve: adminProcedure
    .input(requireIdSchema)
    .mutation(async ({ ctx, input }) =>
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
   * @returns {User}
   */
  current: authProcedure.query(async ({ ctx }) =>
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
   * @returns {User} Found user
   * @throws If not found
   */
  unique: adminProcedure.input(requireIdSchema).query(async ({ ctx, input }) =>
    excludePassword(
      await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input },
      })
    )
  ),
  /**
   * Updates user
   *
   * @argument {Partial<User>} input EditInformations values
   */
  update: authProcedure
    .input(getUpdateUserSchema(true))
    .mutation(async ({ ctx, input: { id, ...values } }) =>
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
  /**
   * Updates user password
   *
   * @argument {string} password New password
   */
  updatePassword: authProcedure
    .input(updateUserPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.user.id },
        select: { password: true },
      });

      if (await bcrypt.compare(input.current_password, user.password)) {
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { password: await bcrypt.hash(input.password, 10) },
        });

        return "success";
      }

      throw new PP_Error("PASSWORD_MISMATCH");
    }),
});

export default usersRouter;
