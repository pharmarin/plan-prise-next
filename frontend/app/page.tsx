import AuthLayout from "@/app/(auth)/layout";
import Title from "@/components/navigation/Navigation";
import Home from "@/components/pages/Home";

const Index = () => (
  <AuthLayout>
    <Title title="Bienvenue" />
    <Home />
  </AuthLayout>
);

export default Index;
