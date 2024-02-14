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
    medicaments: defineRoute("/admin/medicaments"),
    medicament: defineRoute("/admin/medicaments/[medicamentId]", {
      params: z.object({
        medicamentId: z.string().cuid2(),
      }),
    }),
    principesActifs: defineRoute("/admin/principes-actifs", {
      search: z
        .object({
          edit: z.string().cuid2().optional(),
        })
        .default({ edit: undefined }),
    }),
  }));
