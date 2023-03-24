import {
  adminProcedure,
  authProcedure,
  guestProcedure,
  router,
} from "@/trpc/trpc";
import checkRecaptcha from "@/utils/check-recaptcha";
import PP_Error from "@/utils/errors";
import sendMail from "@/utils/mail";
import {
  getRegisterSchema,
  getUpdateUserSchema,
  passwordVerifySchema,
  requireIdSchema,
  updateUserPasswordSchema,
} from "@/validation/users";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { startCase, upperCase } from "lodash";

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
    .mutation(async ({ ctx, input }) => {
      const user = excludePassword(
        await ctx.prisma.user.update({
          where: { id: input },
          data: { approvedAt: new Date() },
        })
      );

      await sendMail(
        { email: user.email, name: `${user.firstName} ${user.lastName}` },
        "Votre compte a été validé !",
        "351ndgwr91d4zqx8"
      );

      return "success";
    }),
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
   * Verify that password matches records
   *
   * @argument {string} id User id
   * @argument {string} password Password value
   *
   * @returns {string} "success" on succeed
   *
   * @throws {PasswordMismatch}
   */
  passwordVerify: authProcedure
    .input(passwordVerifySchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input.id },
        select: { password: true },
      });

      if (await bcrypt.compare(input.password, user.password)) {
        return "success";
      }

      throw new PP_Error("PASSWORD_MISMATCH");
    }),
  /**
   * Registers the user
   *
   * @argument {typeof User} input RegisterForm values
   *
   * @returns {string} "success" on succeed
   *
   * @throws Error on fail
   */
  register: guestProcedure
    .input(getRegisterSchema(true))
    .mutation(async ({ ctx, input }) => {
      const recaptcha = await checkRecaptcha(input.recaptcha || "");

      if (!recaptcha) {
        throw new PP_Error("RECAPTCHA_LOADING_ERROR");
      }

      if (recaptcha <= 0.5) {
        throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
      }

      const firstName = startCase(input.firstName.toLowerCase());
      const lastName = upperCase(input.lastName);
      const displayName = input.displayName
        ? startCase(input.displayName.toLowerCase())
        : undefined;

      try {
        await ctx.prisma.user.create({
          data: {
            email: input.email,
            firstName,
            lastName,
            displayName,
            student: input.student || false,
            certificate: input.certificate,
            rpps: BigInt(input.rpps),
            password: await bcrypt.hash(input.password, 10),
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new PP_Error("USER_REGISTER_CONFLICT");
          }
        }
        throw new PP_Error("USER_REGISTER_ERROR");
      }

      sendMail(
        { email: input.email, name: `${firstName} ${lastName}` },
        "Bienvenue sur plandeprise.fr !",
        "pq3enl6xr8rl2vwr"
      );

      fetch(process.env.NTFY_URL_ADMIN || "", {
        method: "POST",
        body: `${(
          await ctx.prisma.user.count({ where: { approvedAt: null } })
        ).toString()} en attente`,
        headers: {
          Actions: `view, Approuver, ${process.env.FRONTEND_URL}/admin/users`,
          Click: `${process.env.FRONTEND_URL}/admin/users`,
          Tags: "+1",
          Title: `Nouvelle inscription sur ${process.env.APP_NAME}`,
        },
      });

      return "success";
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
