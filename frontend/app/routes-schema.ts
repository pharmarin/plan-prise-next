import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export const { routes, useSafeParams, useSafeSearchParams } =
  createNavigationConfig((defineRoute) => ({
    home: defineRoute("/"),

    // Guest routes
    login: defineRoute("/login", {
      search: z
        .object({
          redirect: z.string().optional(),
        })
        .default({ redirect: undefined }),
    }),
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
    planCreate: defineRoute("/plan/nouveau"),
    profil: defineRoute("/profil"),

    // Admin routes
    adminDashboard: defineRoute("/admin"),
    users: defineRoute("/admin/utilisateurs"),
    user: defineRoute("/admin/utilisateurs/[userId]", {
      params: z.object({
        userId: z.string().cuid2(),
      }),
    }),
  }));
