import { getServerSession } from "@/next-auth/get-session";
import prisma from "@/prisma";
import { redirect } from "next/navigation";

const AuthGuard = async ({
  children,
  guest,
  searchParams,
}: {
  children: React.ReactNode;
  guest?: boolean;
  searchParams?: {
    redirectTo?: string;
  };
}) => {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { id: session?.user.id || "" },
  });
  //const pathname = window.location.pathname;

  if (!user || (!guest && !session)) {
    redirect(
      `/login${
        "" // (pathname && pathname !== "/" && `?redirectTo=${pathname}`) || ""
      }`
    );
  }

  if (guest && session) {
    redirect(searchParams?.redirectTo || "/");
  }

  if (!user.firstName || !user.lastName) {
    return redirect("/profil" as __next_route_internal_types__.StaticRoutes);
  }

  return children;
};

export default AuthGuard;
