import checkRecaptcha from "@/common/check-recaptcha";
import PasswordMismatch from "@/common/errors/PasswordMismatch";
import ReCaptchaNotLoaded from "@/common/errors/ReCaptchaNotLoaded";
import ReCaptchaVerificationError from "@/common/errors/ReCaptchaVerificationError";
import {
  getRegisterSchema,
  passwordVerifySchema,
} from "@/common/validation/auth";
import { authProcedure, guestProcedure, router } from "@/server/trpc/trpc";
import { Prisma } from "@plan-prise/prisma";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { startCase, upperCase } from "lodash";

const authRouter = router({
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
        throw new ReCaptchaNotLoaded();
      }

      if (recaptcha <= 0.5) {
        throw new ReCaptchaVerificationError();
      }

      try {
        await ctx.prisma.user.create({
          data: {
            email: input.email,
            firstName: startCase(input.firstName.toLowerCase()),
            lastName: upperCase(input.lastName),
            displayName: input.displayName
              ? startCase(input.displayName.toLowerCase())
              : undefined,
            student: input.student || false,
            certificate: input.certificate as string,
            rpps: BigInt(input.rpps),
            password: await bcrypt.hash(input.password, 10),
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "Un utilisateur est déjà inscrit avec cette adresse email. ",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Une erreur est survenue lors de l'inscription. ",
        });
      }

      return "success";
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

      throw new PasswordMismatch();
    }),
});

export default authRouter;
