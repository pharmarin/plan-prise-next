"use client";

import { useRouter } from "next/navigation";
import ShowPDF from "@/app/(auth)/admin/users/[id]/certificate/ShowPDF";
import ApproveButton from "@/app/(auth)/admin/users/ApproveButton";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { XMarkIcon } from "@heroicons/react/20/solid";

import PP_Error from "@plan-prise/errors";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const ApproveStudent = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = trpc.users.unique.useQuery(params.id);

  if (isLoading) {
    return <div>Chargement en cours</div>;
  }

  if (error) {
    return <div>Impossible de charger le certificat de scolarité</div>;
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
          <Button
            onClick={() => router.push("/admin/users")}
            variant="destructive"
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {(() => {
        if (
          user.certificate?.startsWith("data:image/jpeg") ??
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
