import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

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
