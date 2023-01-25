import FormInfo from "components/forms/FormInfo";
import { Errors } from "jsonapi-typescript";
import React from "react";

const ServerErrors: React.FC<{ errors?: Errors }> = ({ errors }) => {
  return (
    <>
      {errors?.map((error) => (
        <FormInfo color="red">{error.detail}</FormInfo>
      ))}
    </>
  );
};

export default ServerErrors;
