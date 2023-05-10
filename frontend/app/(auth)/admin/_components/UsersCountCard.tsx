import Card from "@/components/Card";
import prisma from "@/prisma";
import Link from "next/link";

const UsersCountCard = async () => {
  const count = await prisma.user.count();

  return (
    <Link href="/admin/users">
      <Card className="flex h-44 flex-col justify-center text-center">
        <span className="text-6xl text-blue-700">{count}</span>
        <span className="text-3xl text-blue-500">Utilisateurs inscrits</span>
      </Card>
    </Link>
  );
};

export default UsersCountCard;
