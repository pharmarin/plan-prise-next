import Error404 from "@plan-prise/ui/components/pages/404";

const PlanNotFound = () => (
  <Error404 title="Ce médicament n'existe pas" returnTo="/admin/medics" />
);

export default PlanNotFound;
