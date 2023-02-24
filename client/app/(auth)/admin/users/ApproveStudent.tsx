import { XMarkIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import ApproveButton from "app/(auth)/admin/users/ApproveButton";
import Button from "components/forms/inputs/Button";
import dynamic from "next/dynamic";
import { useAsync } from "react-async-hook";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const ApproveStudent: React.FC<{ close: () => void; user: User }> = ({
  close,
  user,
}) => {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

  const Document = dynamic(
    () =>
      import("react-pdf/dist/esm/entry.webpack5").then(
        (imported) => imported.Document
      ),
    { ssr: false }
  );

  const Page = dynamic(
    () =>
      import("react-pdf/dist/esm/entry.webpack5").then(
        (imported) => imported.Page
      ),
    { ssr: false }
  );

  const {
    result: data,
    error,
    loading,
  } = useAsync(() => {
    // TODO user.getCertificate()
    return new Promise(() => {});
  }, [user.id]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold text-gray-700">
          Justificatif d&apos;inscription pour l&apos;étudiant {user.firstName}{" "}
          {user.lastName}
        </h2>
        <div className="space-x-2">
          <ApproveButton onSuccess={close} user={user} />
          <Button className="bg-red-600" onClick={close}>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {loading && <div>Chargement du document en cours...</div>}
      {error && (
        <div>
          {error.name} : {error.message}
        </div>
      )}
      {data?.type === "pdf" && (
        <Document file={data.data}>
          <Page pageNumber={1} />
        </Document>
      )}
      {data?.type === "image" && <img src={data?.data} />}
    </div>
  );
};
export default ApproveStudent;
