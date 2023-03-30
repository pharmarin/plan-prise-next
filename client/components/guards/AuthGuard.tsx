import IncompleteProfileGuard from "@/components/guards/IncompleteProfileGuard";
import { getServerSession } from "@/next-auth/get-session";
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
  //const pathname = window.location.pathname;

  if (!guest && !session) {
    redirect(
      `/login${
        "" // (pathname && pathname !== "/" && `?redirectTo=${pathname}`) || ""
      }`
    );
  }

  if (guest && session) {
    redirect(searchParams?.redirectTo || "/");
  }

  if (!guest && session) {
    return <IncompleteProfileGuard>{children}</IncompleteProfileGuard>;
  }

  if (guest && !session) {
    return children;
  }
};

export default AuthGuard;
