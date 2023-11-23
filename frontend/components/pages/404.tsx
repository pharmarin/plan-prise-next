import Link from "@/components/navigation/Link";
import ErrorSkeleton from "@/components/pages/ErrorSkeleton";

const Error404 = ({
  returnTo,
  title,
}: {
  returnTo?: string;
  title?: string;
}) => {
  return (
    <ErrorSkeleton
      action={<Link href={returnTo ?? "/"}>Retour</Link>}
      logo={
        <div className="flex font-bold">
          <div className="-translate-x-4 rotate-12 whitespace-nowrap rounded-l-full bg-white py-1 pl-2 pr-0.5 text-gray-900 shadow-lg">
            Plan de
          </div>
          <div className="-rotate-12 rounded-r-full bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pl-0.5 pr-2 text-white shadow-lg">
            prise
          </div>
        </div>
      }
      subtitle="Erreur 404"
      title={title ?? "Page introuvable"}
    />
  );
};

export default Error404;
