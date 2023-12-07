import React from "react";

import { Avatar, AvatarFallback } from "../../shadcn/ui/avatar";

export const Initials: React.FC<{ firstName: string; lastName: string }> = ({
  firstName,
  lastName,
}) => {
  return (
    <Avatar>
      <AvatarFallback className="bg-teal-500 text-lg uppercase text-white">
        {firstName[0]}
        {lastName[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default Initials;
