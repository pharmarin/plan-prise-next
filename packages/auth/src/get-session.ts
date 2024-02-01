"use server";

import { getServerSession as $getServerSession } from "next-auth";

import { nextAuthOptions } from "./index";

export const getServerSession = () => $getServerSession(nextAuthOptions);
