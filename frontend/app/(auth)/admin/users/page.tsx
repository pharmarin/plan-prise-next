import Navigation from "@/app/_components/Navigation";
import UsersClient from "@/app/(auth)/admin/users/client";

const PAGE_TITLE = "Utilisateurs";

const Users = async () => {
  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo="/admin" />

      <UsersClient />
    </>
  );
};

export default Users;

export const metadata = {
  title: PAGE_TITLE,
};
