import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@plan-prise/api";

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});
