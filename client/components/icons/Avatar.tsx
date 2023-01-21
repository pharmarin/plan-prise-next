import RoundedIcon from "components/icons/RoundedIcon";
import React from "react";

const Avatar: React.FC<{ firstName: string; lastName: string }> = ({
  firstName,
  lastName,
}) => {
  return (
    <RoundedIcon color="primary">
      <span className="text-lg uppercase text-white">
        {firstName[0]}
        {lastName[0]}
      </span>
    </RoundedIcon>
  );
};

export default Avatar;
