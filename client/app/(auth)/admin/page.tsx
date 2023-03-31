import Navigation from "@/components/navigation/Navigation";
import Link from "next/link";

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
