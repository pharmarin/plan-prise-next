export const exclude = <User extends object, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> =>
  Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<User, Key>;
