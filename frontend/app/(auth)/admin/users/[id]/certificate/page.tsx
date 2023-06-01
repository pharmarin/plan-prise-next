"use client";

import ApproveButton from "@/app/(auth)/admin/users/ApproveButton";
import ShowPDF from "@/app/(auth)/admin/users/[id]/certificate/ShowPDF";
import Button from "@/components/forms/inputs/Button";
import { trpc } from "@/trpc/client";
import PP_Error from "@/utils/errors";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { use } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const ApproveStudent = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const user = use(trpc.users.unique.query(params.id));

  if (!user) {
    return <div>Chargement en cours</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold text-gray-700">
          Justificatif d&apos;inscription pour l&apos;étudiant {user.firstName}{" "}
          {user.lastName}
        </h2>
        <div className="space-x-2">
          <ApproveButton
            onSuccess={() => router.push("/admin/users")}
            user={user}
          />
          <Button color="red" onClick={() => router.push("/admin/users")}>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {(() => {
        if (
          user.certificate?.startsWith("data:image/jpeg") ||
          user.certificate?.startsWith("data:image/png")
        ) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Certificat de scolarité pour ${user.firstName} ${user.lastName}`}
              src={user.certificate}
            />
          );
        }

        if (user.certificate?.startsWith("data:application/pdf")) {
          return <ShowPDF file={user.certificate} />;
        }

        throw new PP_Error("UNEXPECTED_FILE_TYPE");
      })()}
    </div>
  );
};
export default ApproveStudent;
