import Link from "@/components/navigation/Link";
import Navigation from "@/components/navigation/Navigation";

const AdminDashboard = () => {
  return (
    <div>
      <Navigation title="Administration" />
      <div>AdminDashboard</div>
      <Link href={"/admin/users"}>Utilisateurs</Link>
    </div>
  );
};

export default AdminDashboard;
