import ChartCard from "@/app/(auth)/admin/_components/ChartCard";
import UsercountCard from "@/app/(auth)/admin/_components/UsercountCard";
import Card from "@/components/Card";
import Navigation from "@/components/navigation/Navigation";

const AdminDashboard = async () => {
  return (
    <div className="space-y-6">
      <Navigation title="Administration" />
      <div>
        <div className="mb-2 text-2xl font-bold text-blue-600">
          Utilisateurs
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* @ts-expect-error Server Component */}
          <UsercountCard />
          {/* @ts-expect-error Server Component */}
          <ChartCard type="users" />
        </div>
      </div>

      <div>
        <div className="mb-2 text-2xl font-bold text-pink-600">
          Plans de prise
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="flex h-44 flex-col justify-center text-center">
            <span className="text-6xl text-pink-700">{/* TODO */}#</span>
            <span className="text-3xl text-pink-500">Plans de prise créés</span>
          </Card>
          {/* @ts-expect-error Server Component */}
          <ChartCard type="plans" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
