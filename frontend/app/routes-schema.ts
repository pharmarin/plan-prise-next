import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export const { routes, useSafeParams, useSafeSearchParams } =
  createNavigationConfig((defineRoute) => ({
    home: defineRoute("/"),

    // Guest routes
    login: defineRoute("/login"),
    register: defineRoute("/register"),
    passwordAskReset: defineRoute("/forgot-password"),
    passwordReset: defineRoute("/password-reset"),

    // Auth routes
    plans: defineRoute("/plan"),
    plan: defineRoute("/plan/[planId]", {
      params: z.object({
        planId: z.coerce.number(),
      }),
    }),
    planCreate: defineRoute("/plan/new"),
    profil: defineRoute("/profil"),

    // Admin routes
    adminDashboard: defineRoute("/admin"),
    users: defineRoute("/admin/users"),
    user: defineRoute("/admins/users/[userId]", {
      params: z.object({
        userId: z.string().cuid2(),
      }),
    }),
  }));
