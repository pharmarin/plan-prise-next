import ChartCard from "@/app/(auth)/admin/_components/ChartCard";
import PlansCountCard from "@/app/(auth)/admin/_components/PlansCountCard";
import UsersCountCard from "@/app/(auth)/admin/_components/UsersCountCard";
import Navigation from "@/components/navigation/Navigation";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <Navigation title="Administration" />
      <div>
        <div className="mb-2 text-2xl font-bold text-blue-600">
          Utilisateurs
        </div>
        <div className="grid grid-cols-3 gap-4">
          <UsersCountCard />
          <ChartCard type="users" />
        </div>
      </div>

      <div>
        <div className="mb-2 text-2xl font-bold text-pink-600">
          Plans de prise
        </div>
        <div className="grid grid-cols-3 gap-4">
          <PlansCountCard />
          <ChartCard type="plans" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
