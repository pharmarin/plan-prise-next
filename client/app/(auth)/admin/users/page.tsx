import UsersTable from "@/app/(auth)/admin/users/UsersTable";
import Navigation from "@/components/navigation/Navigation";

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
