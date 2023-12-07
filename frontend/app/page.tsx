import Title from "@/app/_components/Navigation";
import AuthLayout from "@/app/(auth)/layout";

import Home from "@plan-prise/ui/components/pages/Home";

import "../../packages/db-prisma/src/types";

const Index = () => (
  <AuthLayout>
    <Title title="Bienvenue" />
    <Home />
  </AuthLayout>
);

export default Index;
