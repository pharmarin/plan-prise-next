import { cache } from "react";
import { getServerSession as $getServerSession } from "next-auth";

import { nextAuthOptions } from "./index";

export const getServerSession = cache(() => $getServerSession(nextAuthOptions));
