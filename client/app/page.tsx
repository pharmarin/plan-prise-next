import AuthLayout from "@/app/(auth)/layout";
import Home from "@/app/Home";
import Title from "@/components/navigation/Navigation";

const Index = () => (
  <AuthLayout>
    <Title title="Bienvenue" />
    <Home />
  </AuthLayout>
);

export default Index;
