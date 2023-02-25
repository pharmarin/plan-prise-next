import { approveUserSchema } from "common/validation/users";
import { adminProcedure, router } from "server/trpc/trpc";

const usersRouter = router({
  approve: adminProcedure
    .input(approveUserSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: input },
        data: { approvedAt: new Date() },
      });
    }),
});

export default usersRouter;
