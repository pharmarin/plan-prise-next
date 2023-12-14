import UsersClient from "@/app/(auth)/admin/users/client";
import { Navigation } from "@/state/navigation";

const PAGE_TITLE = "Utilisateurs";

const UsersServer = async () => {
  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo="/admin" />
      <UsersClient />
    </>
  );
};

export default UsersServer;

export const metadata = {
  title: PAGE_TITLE,
};
