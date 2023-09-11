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
    console.log("User not logged in, redirecting")
    
    return redirect(
      `/login${
        "" // (pathname && pathname !== "/" && `?callbackUrl=${pathname}`) || ""
      }`
    );
  }

  if (guest && session) {
    return redirect(searchParams?.redirectTo || "/");
  }

  // INFO: Redirect to profil page if incomplete is handled in Navbar.tsx

  return <>{children}</>;
};

export default AuthGuard;
