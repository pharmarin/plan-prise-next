"use client";

import { useState } from "react";
import { approveUserAction } from "@/app/(auth)/admin/utilisateurs/actions";
import type { User } from "@prisma/client";
import { Check, Loader2, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { MUTATION_SUCCESS } from "@plan-prise/api/constants";
import { Button } from "@plan-prise/ui/button";
import { cn } from "@plan-prise/ui/shadcn/lib/utils";

const TestButton = ({
  approved,
  userId,
}: {
  approved: boolean;
  userId: User["id"];
}) => {
  const [isApproved, setIsApproved] = useState(approved);

  const { isExecuting: isLoading, executeAsync: approveUser } =
    useAction(approveUserAction);

  return (
    <Button
      className={cn("absolute right-0 top-0 aspect-square h-24 w-24", {
        "bg-red-500 hover:bg-red-400": !isApproved,
        "cursor-default bg-green-500 disabled:opacity-100": isApproved,
        "cursor-not-allowed bg-gray-500 hover:bg-gray-400": isLoading,
      })}
      disabled={isLoading || approved}
      onClick={async () => {
        const response = await approveUser({ userId });

        if (response?.data === MUTATION_SUCCESS) {
          setIsApproved(true);
        }
      }}
    >
      {isLoading ? (
        <Loader2 className="h-16 w-16 animate-spin" />
      ) : isApproved ? (
        <Check className="h-16 w-16" />
      ) : (
        <X className="h-16 w-16" />
      )}
    </Button>
  );
};

export default TestButton;
