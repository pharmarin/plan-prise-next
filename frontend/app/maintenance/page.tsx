import "../globals.css";

import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

const MaintenanceMode = () => {
  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="flex flex-1 items-center justify-center rounded-lg bg-white">
        <div className="flex divide-x">
          <div className="flex items-center pr-4">
            <div className="flex animate-pulse font-bold">
              <div className="whitespace-nowrap rounded-l-full bg-white py-1 pl-2 pr-0.5 text-gray-900 shadow-lg">
                Plan de
              </div>
              <div className="rounded-r-full bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pl-0.5 pr-2 text-white shadow-lg">
                prise
              </div>
            </div>
          </div>
          <div className="space-y-2 pl-4">
            <TypographyH1>Maintenance en cours</TypographyH1>
            <TypographyMuted>Veuillez réessayer plus tard</TypographyMuted>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
