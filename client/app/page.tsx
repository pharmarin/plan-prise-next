import AuthLayout from "@/app/(auth)/layout";
import Home from "@/app/Home";
import Title from "@/components/navigation/Title";

const Index = () => {
  return (
    <AuthLayout>
      <Title title="Bienvenue" />
      <Home />
    </AuthLayout>
  );
};

export default Index;
