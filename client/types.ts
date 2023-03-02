import { Errors, ResourceObject } from "jsonapi-typescript";
import { NavbarIcons } from "lib/redux/navigation/slice";

/**
 * REDUX
 */

// AUTH

export type AuthState = {
  user: { isLoading: boolean; data?: UserObject };
  login: {
    isLoading: boolean;
    error?: Errors;
  };
};

// NAVIGATION

export type NavigationItem = {
  icon: NavbarIcons;
  className?: string;
} & ({ path: string } | { event: string });

export type NavigationState = {
  options?: NavigationItem[];
  returnTo?: NavigationItem;
  title: string;
};

export type ResourcesState = {
  [type: string]: { [id: string]: ResourceObject };
};

/**
 * MODELS
 */

type UserAttributes = {
  admin: boolean;
  active: boolean;
  firstName: string;
  lastName: string;
  name: string;
  displayName?: string;
  email: string;
  rpps?: number;
  student: boolean;
  createdAt?: string;
};

export type UserObject = ResourceObject<"users", UserAttributes>;
