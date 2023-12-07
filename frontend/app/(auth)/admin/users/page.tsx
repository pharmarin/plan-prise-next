import Navigation from "@/app/_components/Navigation";
import UsersTable from "@/app/(auth)/admin/users/UsersTable";

const PAGE_TITLE = "Utilisateurs";

const Users = () => {
  return (
    <>
      <Navigation title={PAGE_TITLE} returnTo="/admin" />
      <UsersTable />
    </>
  );
};

export default Users;

export const metadata = {
  title: PAGE_TITLE,
};
