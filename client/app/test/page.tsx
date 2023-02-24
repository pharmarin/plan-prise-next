"use client";

import { trpc } from "common/trpc";

const Test = () => {
  const { data } = trpc.auth.register.useMutation();

  return <div>{data}</div>;
};

export default Test;
