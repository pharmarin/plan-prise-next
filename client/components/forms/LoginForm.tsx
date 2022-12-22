"use client";

import Button from "components/inputs/Button";
import CheckboxInput from "components/inputs/CheckboxInput";
import TextInput from "components/inputs/TextInput";
import { useAuth } from "lib/useAuth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormType = { email: string; password: string; remember?: boolean };

const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<LoginFormType>({ mode: "all" });

  const { errors: loginErrors, login } = useAuth({ middleware: "guest" });

  const onSubmit: SubmitHandler<LoginFormType> = (values) => {
    console.log("values: ", values);

    login(values);
  };

  return (
    <>
      <form className={className} onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-4 text-center text-lg">Se connecter</h3>

        <div className="space-y-2">
          <TextInput
            {...register("email", { required: true })}
            id="login_email"
            label="Adresse mail"
          />
          <TextInput
            {...register("password", { required: true })}
            id="login_password"
            label="Mot de passe"
            type="password"
          />
          <CheckboxInput
            {...register("remember")}
            id="login_remember"
            label="Rester connecté"
            wrapperClassName="justify-center"
          />
        </div>

        <Button
          className="mx-auto mt-4 w-fit"
          disabled={"email" in formErrors || "password" in formErrors}
          loading={isSubmitting}
          type="submit"
        >
          Se connecter
        </Button>
        <p className="mt-4 h-0 text-center text-xs text-red-600">
          {loginErrors[0]}
        </p>
      </form>
    </>
  );
};

export default LoginForm;
