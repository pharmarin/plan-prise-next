import Image from "next/image";
import React from "react";

const Avatar: React.FC<{ firstName: string; lastName: string }> = ({
  firstName,
  lastName,
}) => {
  return (
    <Image
      alt=""
      className="h-8 w-8 rounded-full"
      height={50}
      width={50}
      src={`https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&color=FFFFFF&background=14b8a6`}
    />
  );
};

export default Avatar;
