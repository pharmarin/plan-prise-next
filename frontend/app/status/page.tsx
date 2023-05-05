"use client";

import { trpc } from "@/trpc/client";

const StatusPage = () => {
  const guestQuery = trpc.tests.guestQuery.useQuery();
  const authQuery = trpc.tests.authQuery.useQuery();

  return (
    <div>
      <div>
        GuestQuery:{" "}
        {guestQuery.data && (
          <span title="Guest Query Result">{guestQuery.data}</span>
        )}
      </div>
      <div>
        AuthQuery:{" "}
        {authQuery.error?.message && (
          <span title="Auth Query Result">{authQuery.error?.message}</span>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
