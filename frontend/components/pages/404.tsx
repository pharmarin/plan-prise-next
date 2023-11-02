import Link from "@/components/navigation/Link";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

const Error404 = ({
  returnTo,
  title,
}: {
  returnTo?: string;
  title?: string;
}) => {
  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="flex flex-1 items-center justify-center rounded-lg bg-white">
        <div className="flex divide-x">
          <div className="flex items-center pr-4">
            <div className="flex font-bold">
              <div className="-translate-x-4 rotate-12 whitespace-nowrap rounded-l-full bg-white py-1 pl-2 pr-0.5 text-gray-900 shadow-lg">
                Plan de
              </div>
              <div className="-rotate-12 rounded-r-full bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pl-0.5 pr-2 text-white shadow-lg">
                prise
              </div>
            </div>
          </div>
          <div className="space-y-2 pl-4">
            <TypographyH1>{title ?? "Page introuvable"}</TypographyH1>
            <TypographyMuted>Erreur 404</TypographyMuted>
            <Link href={returnTo ?? "/"}>Retour</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
