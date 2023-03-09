import { Prisma } from "@plan-prise/prisma";
import PP_Error from "@plan-prise/utils/errors";
import checkRecaptcha from "@plan-prise/utils/recaptcha";
import {
  getRegisterSchema,
  passwordVerifySchema,
} from "@plan-prise/validation";
import bcrypt from "bcrypt";
import { startCase, upperCase } from "lodash";
import { authProcedure, guestProcedure, router } from "../trpc";

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
        throw new PP_Error("RECAPTCHA_LOADING_ERROR");
      }

      if (recaptcha <= 0.5) {
        throw new PP_Error("RECAPTCHA_VALIDATION_ERROR");
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
            throw new PP_Error("USER_REGISTER_CONFLICT");
          }
        }
        throw new PP_Error("USER_REGISTER_ERROR");
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

      throw new PP_Error("PASSWORD_MISMATCH");
    }),
});

export default authRouter;
