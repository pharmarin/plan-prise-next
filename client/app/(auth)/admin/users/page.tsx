import UsersTable from "@/app/(auth)/admin/users/UsersTable";

const Users = () => {
  return <UsersTable />;

  /* useEffect(() => {
     // TODO: useContext
    dispatch(
      setNavigation("Utilisateurs", {
        component: { name: "arrowLeft" },
        path: "/admin",
      })
    ); 
  }); */
};

export default Users;

export const metadata = {
  title: "Utilisateurs",
};
