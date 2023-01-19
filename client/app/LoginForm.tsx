"use client";

import Button from "components/forms/inputs/Button";
import CheckboxInput from "components/forms/inputs/CheckboxInput";
import TextInput from "components/forms/inputs/TextInput";
import { loginUserAction } from "lib/redux/auth/actions";
import { selectLoginError } from "lib/redux/auth/selectors";
import { useDispatch } from "lib/redux/store";
import { useSearchParams } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

type LoginFormType = { email: string; password: string; remember?: boolean };

const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const loginError = useSelector(selectLoginError);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: searchParams.get("email") ?? undefined,
      password: searchParams.get("password") ?? undefined,
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<LoginFormType> = async (values) =>
    dispatch(loginUserAction(values));

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
          gradient
          loading={isSubmitting}
          type="submit"
        >
          Se connecter
        </Button>
        <p className="mt-4 h-0 text-center text-xs text-red-600">
          {loginError?.detail}
        </p>
      </form>
    </>
  );
};

export default LoginForm;
