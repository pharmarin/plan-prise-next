import AuthLayout from "@/app/(auth)/layout";
import Title from "@/components/navigation/Navigation";
import Home from "@/components/pages/Home";

import "../../packages/db-prisma/src/types";

const Index = () => (
  <AuthLayout>
    <Title title="Bienvenue" />
    <Home />
  </AuthLayout>
);

export default Index;
