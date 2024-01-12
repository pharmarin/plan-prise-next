import { revalidatePath } from "next/cache";
import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { startCase, toUpper } from "lodash";

import { findOne } from "@plan-prise/api-pharmaciens";
import checkRecaptcha from "@plan-prise/auth/lib/check-recaptcha";
import {
  checkPassword,
  hashPassword,
} from "@plan-prise/auth/lib/password-utils";
import PP_Error from "@plan-prise/errors";

import { signJWT, verifyJWT } from "../../utils/json-web-token";
import sendMail from "../../utils/mail";
import getUrl from "../../utils/url";
import {
  approveUserSchema,
  confirmPasswordSchema,
  deleteUserSchema,
  forgotPasswordSchema,
  getUniqueUserSchema,
  registerSchema,
  resetPasswordSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "../../validation/users";
import { MUTATION_SUCCESS } from "../constants";
import {
  adminProcedure,
  authProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

const exclude = <User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> => {
  for (const key of keys) {
    delete user[key];
  }
  return user;
};

const pick = <User, Key extends keyof User>(object: User, keys: Key[]) =>
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as User);

const excludePassword = <User extends { password?: string }>(
  user: User,
): Omit<User, "password"> => exclude(user, ["password"]);

const sendMailApproved = (
  user: Pick<User, "email" | "firstName" | "lastName">,
) =>
  sendMail(
    { email: user.email, name: `${user.firstName} ${user.lastName}` },
    "Votre compte a été validé !",
    "351ndgwr91d4zqx8",
  );

const sendMailRegistered = (
  user: Pick<User, "email" | "firstName" | "lastName">,
) =>
  sendMail(
    { email: user.email, name: `${user.firstName} ${user.lastName}` },
    "Bienvenue sur plandeprise.fr !",
    "pq3enl6xr8rl2vwr",
  );

const sendMailReinitPassword = (
  user: Pick<User, "email" | "firstName" | "lastName">,
  token: string,
) =>
  sendMail(
    {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
    "Réinitialisez votre mot de passe... ",
    "jy7zpl95vjo45vx6",
    {
      link: getUrl(`/password-reset?email=${user.email}&token=${token}`),
    },
  );

const formatFirstName = (firstName: string) =>
  startCase(firstName.toLowerCase());
const formatLastName = (lastName: string) => toUpper(lastName);
const formatDisplayName = (displayName?: string | null) =>
  displayName ? startCase(displayName.toLowerCase()) : null;

const usersRouter = createTRPCRouter({
  /**
   * Get all users
   *
   * @argument {never}
   *
   * @returns {User[]} Users
   */
  all: adminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany({
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
    }),
  ),
  /**
   * Approves user
   *
   * @argument {string} id
   *
   * @returns {User} Updated user
   */
  approve: adminProcedure
    .input(approveUserSchema)
    .mutation(async ({ ctx, input }) => {
      const user = excludePassword(
        await ctx.prisma.user.update({
          where: { id: input.id },
          data: { approvedAt: new Date() },
        }),
      );

      try {
        await sendMailApproved(user);
      } catch (error) {
        console.error(
          "Une erreur est survenue lors de l'envoi du mail d'activation. ",
          error,
        );
      }

      return MUTATION_SUCCESS;
    }),
  /**
   * Count users
   *
   * @argument {void}
   *
   * @returns {number} User count
   */
  count: adminProcedure.query(({ ctx }) => ctx.prisma.user.count()),
  /**
   * Get current logged in user details
   *
   * @argument {void} (Uses user id stored in JWT/session)
   *
   * @returns {User}
   */
  current: authProcedure.query(async ({ ctx }) =>
    pick(
      await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
      }),
      ["admin", "firstName", "lastName"],
    ),
  ),
  /**
   * Delete user
   *
   * @argument {string} id User id
   *
   * @returns {undefined}
   */
  delete: adminProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.id } });
    }),
  /**
   * Delete current logged in user
   */
  deleteCurrent: authProcedure
    .input(confirmPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { password: true },
      });

      if (await checkPassword(input.password, user.password)) {
        await ctx.prisma.user.delete({
          where: {
            id: ctx.session.user.id,
          },
        });

        return MUTATION_SUCCESS;
      }

      throw new PP_Error("PASSWORD_MISMATCH");
    }),
  /**
   * Registers the user
   *
   * @argument {typeof User} input RegisterForm values
   *
   * @returns {string} MUTATION_SUCCESS on succeed
   *
   * @throws Error on fail
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const recaptcha = await checkRecaptcha(input.recaptcha ?? "");

      if (!recaptcha) {
        throw new PP_Error("RECAPTCHA_LOADING_ERROR");
      }

      if (recaptcha <= 0.5) {
        throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
      }

      const firstName = formatFirstName(input.firstName);
      const lastName = formatLastName(input.lastName);
      const displayName = formatDisplayName(input.displayName);

      try {
        await ctx.prisma.user.create({
          data: {
            email: input.email,
            firstName,
            lastName,
            displayName,
            student: input.student ?? false,
            certificate:
              input.certificate && "data" in input.certificate
                ? input.certificate.data
                : undefined,
            rpps: input.rpps ? BigInt(input.rpps) : undefined,
            password: await hashPassword(input.password),
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new PP_Error("USER_REGISTER_CONFLICT");
          }
        }

        console.error("Error registering: ", error);
        throw new PP_Error("USER_REGISTER_ERROR");
      }

      try {
        const userFromRPPS = findOne(Number(input.rpps));

        if (
          userFromRPPS &&
          lastName.toLowerCase() === userFromRPPS?.lastName.toLowerCase() &&
          firstName.toLowerCase() === userFromRPPS.firstName.toLowerCase()
        ) {
          await ctx.prisma.user.update({
            where: { email: input.email },
            data: { approvedAt: new Date() },
          });

          await sendMailApproved({ email: input.email, firstName, lastName });

          await fetch(process.env.NTFY_ADMIN_URL ?? "", {
            method: "POST",
            body: `${(
              await ctx.prisma.user.count({ where: { approvedAt: null } })
            ).toString()} en attente`,
            headers: {
              Tags: "+1",
              Title: `Nouvelle inscription approuvée automatiquement sur ${process.env.APP_NAME}`,
            },
          });
        } else {
          await sendMailRegistered({ email: input.email, firstName, lastName });
        }
      } catch (error) {
        console.error("Error sending registration mail: ", error);

        throw new PP_Error("USER_REGISTER_WARNING");
      }

      try {
        await fetch(process.env.NTFY_ADMIN_URL ?? "", {
          method: "POST",
          body: `${(
            await ctx.prisma.user.count({ where: { approvedAt: null } })
          ).toString()} en attente`,
          headers: {
            Actions: `view, Approuver, ${getUrl("/admin/users")}`,
            Click: getUrl("/admin/users"),
            Tags: "+1",
            Title: `Nouvelle inscription sur ${process.env.APP_NAME}`,
          },
        });
      } catch (error) {
        console.error("Error sending registration admin notification: ", error);
      }

      return MUTATION_SUCCESS;
    }),
  /**
   * Resets user password
   *
   * @argument {string} password Form password
   * @argument {string} token Token sent via mail (payload = User.id)
   *
   * @returns {string} MUTATION_SUCCESS
   * @throws {PP_Error} If invalid token
   * @throws {PrismaError} If unknown User.id
   */
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { password, token } = input;

      try {
        const { payload } = await verifyJWT(token);

        if (payload?.user_id && typeof payload.user_id === "string") {
          await ctx.prisma.user.update({
            where: { id: payload.user_id },
            data: { password: await hashPassword(password) },
          });

          return MUTATION_SUCCESS;
        }

        throw new Error();
      } catch (error) {
        throw new PP_Error("SERVER_ERROR");
      }
    }),
  /**
   * Sends a reset password mail if the user exists
   *
   * @argument {string} email User email
   * @argument {string} recaptcha Recaptcha from the form
   *
   * @returns {string} MUTATION_SUCCESS on succeed
   *
   * @throws Error on fail
   */
  sendPasswordResetLink: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const recaptcha = await checkRecaptcha(input.recaptcha ?? "");

      if (!recaptcha) {
        throw new PP_Error("RECAPTCHA_LOADING_ERROR");
      }

      if (recaptcha <= 0.5) {
        throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
      }

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { email: input.email },
      });

      const token = await signJWT({ user_id: user.id });

      await sendMailReinitPassword(user, token);

      return MUTATION_SUCCESS;
    }),
  /**
   * Get unique user
   *
   * @argument {string} id User id
   *
   * @returns {User} Found user
   * @throws If not found
   */
  unique: adminProcedure
    .input(getUniqueUserSchema)
    .query(async ({ ctx, input }) =>
      excludePassword(
        await ctx.prisma.user.findUniqueOrThrow({
          where: { id: input },
        }),
      ),
    ),
  /**
   * Updates user
   *
   * @argument {Partial<User>} input EditInformations values
   */
  update: authProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input: { id, ...input } }) => {
      const user = excludePassword(
        await ctx.prisma.user.update({
          where: { id },
          data: {
            ...input,
            firstName: formatFirstName(input.firstName),
            lastName: formatLastName(input.lastName),
            displayName: formatDisplayName(input.displayName),
            rpps: input.rpps ? BigInt(input.rpps) : undefined,
          },
        }),
      );

      revalidatePath("/profil");

      return user;
    }),
  /**
   * Updates user password
   *
   * @argument {string} password New password
   *
   * @returns {string} MUTATION_SUCCESS
   * @throws {PP_Error} PASSWORD_MISMATCH
   * @throws {PrismaError} If unknown User.id
   */
  updatePassword: authProcedure
    .input(updateUserPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { password: true },
      });

      if (await checkPassword(input.current_password, user.password)) {
        await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { password: await hashPassword(input.password) },
        });

        return MUTATION_SUCCESS;
      }

      throw new PP_Error("PASSWORD_MISMATCH");
    }),
});

export default usersRouter;
