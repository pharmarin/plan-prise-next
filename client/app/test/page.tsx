"use client";

import { signIn } from "next-auth/react";

const Test = () => {
  return (
    <button
      onClick={() => {
        signIn("credentials", {
          email: "rouxmarin@outlook.com",
          password: "gas1ton74300",
          redirect: false,
        });
      }}
    >
      Test
    </button>
  );
};

export default Test;
