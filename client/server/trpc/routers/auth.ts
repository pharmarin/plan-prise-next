import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import checkRecaptcha from "common/check-recaptcha";
import ReCaptchaNotLoaded from "common/errors/ReCaptchaNotLoaded";
import ReCaptchaVerificationError from "common/errors/ReCaptchaVerificationError";
import UnexpectedMethod from "common/errors/UnexpectedMethod";
import { registerSchema } from "common/validation/auth";
import { guestProcedure, router } from "server/trpc/trpc";

const authRouter = router({
  register: guestProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.req.method !== "POST") {
        throw new UnexpectedMethod();
      }

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
            firstName: input.firstName,
            lastName: input.lastName,
            displayName: input.displayName,
            student: input.student || false,
            certificate: input.certificate,
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
});

export default authRouter;
