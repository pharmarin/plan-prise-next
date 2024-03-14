import { routes } from "@/app/routes-schema";

import Error404 from "@plan-prise/ui/components/pages/404";

const UserNotFound = () => (
  <Error404 title="Cet utilisateur est introuvable" returnTo={routes.users()} />
);

export default UserNotFound;
