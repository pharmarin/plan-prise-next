import { routes } from "@/app/routes-schema";

import Error404 from "@plan-prise/ui/components/pages/404";

const PlanNotFound = () => (
  <Error404
    title="Ce médicament n'existe pas"
    returnTo={routes.medicaments()}
  />
);

export default PlanNotFound;
