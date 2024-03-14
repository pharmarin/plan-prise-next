import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export enum GUEST_ROUTES {
  LOGIN = "/login",
  REGISTER = "/register",
  PASSWORD_ASK_RESET = "/forgot-password",
  PASSWORD_RESET = "/password-reset",
}

export enum AUTH_ROUTES {
  PLAN_INDEX = "/plan",
  PLAN_SINGLE = "/plan/[planId]",
  PLAN_PRINT = "/plan/[planId]/imprimer",
  PLAN_NEW = "/plan/nouveau",
  PROFILE = "/profil",
}

export enum ADMIN_ROUTES {
  DASHBOARD = "/admin",
  USER_INDEX = "/admin/utilisateurs",
  USER_SINGLE = "/admin/utilisateurs/[userId]",
  MEDIC_INDEX = "/admin/medicaments",
  MEDIC_SINGLE = "/admin/medicaments/[medicamentId]",
  MEDIC_NEW = "/admin/medicaments/nouveau",
  PA_INDEX = "/admin/principes-actifs",
}

export const { routes, useSafeParams, useSafeSearchParams } =
  createNavigationConfig((defineRoute) => ({
    home: defineRoute("/"),

    // Guest routes
    login: defineRoute(GUEST_ROUTES.LOGIN, {
      search: z
        .object({
          redirect: z.string().optional(),
        })
        .default({ redirect: undefined }),
    }),
    register: defineRoute(GUEST_ROUTES.REGISTER),
    passwordAskReset: defineRoute(GUEST_ROUTES.PASSWORD_ASK_RESET),
    passwordReset: defineRoute(GUEST_ROUTES.PASSWORD_RESET),

    // Auth routes
    plans: defineRoute(AUTH_ROUTES.PLAN_INDEX),
    plan: defineRoute(AUTH_ROUTES.PLAN_SINGLE, {
      params: z.object({
        planId: z.coerce.number(),
      }),
    }),
    planPrint: defineRoute(AUTH_ROUTES.PLAN_PRINT, {
      params: z.object({
        planId: z.coerce.number(),
      }),
    }),
    planCreate: defineRoute(AUTH_ROUTES.PLAN_NEW),
    profil: defineRoute(AUTH_ROUTES.PROFILE),

    // Admin routes
    adminDashboard: defineRoute(ADMIN_ROUTES.DASHBOARD),
    users: defineRoute(ADMIN_ROUTES.USER_INDEX),
    user: defineRoute(ADMIN_ROUTES.USER_SINGLE, {
      params: z.object({
        userId: z.string().cuid2(),
      }),
    }),
    medicaments: defineRoute(ADMIN_ROUTES.MEDIC_INDEX),
    medicament: defineRoute(ADMIN_ROUTES.MEDIC_SINGLE, {
      params: z.object({
        medicamentId: z.string().cuid2(),
      }),
    }),
    medicamentCreate: defineRoute(ADMIN_ROUTES.MEDIC_NEW),
    principesActifs: defineRoute(ADMIN_ROUTES.PA_INDEX, {
      search: z
        .object({
          edit: z.string().cuid2().optional(),
        })
        .default({ edit: undefined }),
    }),
  }));
