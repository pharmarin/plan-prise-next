import UsercountCard from "@/app/(auth)/admin/_components/UsercountCard";
import Card from "@/components/Card";
import Chart from "@/components/Chart";
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
          <Card className="col-span-2 flex h-44 items-center justify-center">
            <Chart
              color="blue"
              data={[2, 5, 1, 6, 9, 3, 5]}
              labels={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
              ]}
            />
          </Card>
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
          <Card className="col-span-2 h-44">
            {/* TODO */}
            Chart
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
