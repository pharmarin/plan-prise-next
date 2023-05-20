import { nextAuthOptions } from "@/next-auth/options";
import { getServerSession as $getServerSession } from "next-auth";

export const getServerSession = () => $getServerSession(nextAuthOptions);
