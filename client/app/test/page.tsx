"use client";

import { loginUserAction } from "lib/redux/auth/actions";
import { useDispatch } from "lib/redux/store";

const Test = () => {
  const dispatch = useDispatch();
  /* const prisma = new PrismaClient();

  const users = await prisma.usersLegacy.findFirst();
  console.log("users: ", users); */

  return (
    <button
      onClick={async () => {
        await dispatch(
          loginUserAction({
            email: "rouxmarin@outlook.com",
            password: "gas1ton74300",
          })
        );
      }}
    >
      Test
    </button>
  );
};

export default Test;
