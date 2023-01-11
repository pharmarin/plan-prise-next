import { ErrorObject, ResourceObject } from "jsonapi-typescript";
import { NavbarIcons } from "lib/redux/navigation/slice";

/* 
export type User = {
  id: number;
  admin: boolean;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  student: boolean;
  rpps?: number;
  email: string;
  created_at: string;
  updated_at: string;
  active_at?: string;
}; */

export type LoginCredentials = {
  email: string;
  password: string;
  remember?: boolean;
};

/**
 * REDUX
 */

// AUTH

export type AuthState = {
  user: { isLoading: boolean; data?: UserObject };
  login: {
    isLoading: boolean;
    error?: ErrorObject;
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
  firstName: string;
  lastName: string;
  //name: string;
  displayName?: string;
  email: string;
  rpps?: string;
  student: boolean;
  createdAt: string;
  activeAt?: string;
};

export type UserObject = ResourceObject<"users", UserAttributes>;
