import { routes } from "@/app/routes-schema";

import Error404 from "@plan-prise/ui/components/pages/404";

const PlanNotFound = () => (
  <Error404 title="Plan de prise introuvable" returnTo={routes.plans()} />
);

export default PlanNotFound;
