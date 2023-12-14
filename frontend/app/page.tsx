import AuthLayout from "@/app/(auth)/layout";
import { Navigation } from "@/state/navigation";

import Home from "@plan-prise/ui/components/pages/Home";

import "../../packages/db-prisma/src/types";

const Index = () => {
  return (
    <AuthLayout>
      <Navigation title="Bienvenue" />
      <Home />
    </AuthLayout>
  );
};

export default Index;
