import axios from "lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: { middleware?: string; redirectIfAuthenticated?: string } = {}) => {
  const router = useRouter();

  const [errors, setErrors] = useState<string[]>([]);

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  /* const register = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  }; */

  const login = async (credentials: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/login", credentials)
      .then(() => mutate())
      .catch((error) => {
        setErrors([error.response.data.message]);
      });
  };

  /* const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  }; */

  /* const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: router.query.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  }; */

  /* const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  }; */

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === "auth" && error) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error]);

  return {
    errors,
    user,
    //register,
    login,
    //forgotPassword,
    //resetPassword,
    //resendEmailVerification,
    logout,
  };
};
