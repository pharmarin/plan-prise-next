import { approveUserSchema } from "common/validation/users";
import { adminProcedure, router } from "server/trpc/trpc";

const usersRouter = router({
  approve: adminProcedure.input(approveUserSchema).mutation(
    async ({ ctx, input }) =>
      await ctx.prisma.user.update({
        where: { id: input },
        data: { approvedAt: new Date() },
      })
  ),
  findMany: adminProcedure.query(
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
      })
  ),
  count: adminProcedure.query(async ({ ctx }) => await ctx.prisma.user.count()),
});

export default usersRouter;
