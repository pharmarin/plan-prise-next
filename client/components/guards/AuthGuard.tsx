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

  if (!guest && (!session || !user)) {
    return redirect(
      `/login${
        "" // (pathname && pathname !== "/" && `?callbackUrl=${pathname}`) || ""
      }`
    );
  }

  if (guest && session) {
    if (!user?.firstName || !user?.lastName) {
      return redirect("/profil" as __next_route_internal_types__.StaticRoutes);
    }

    return redirect(searchParams?.redirectTo || "/");
  }

  return children;
};

export default AuthGuard;
