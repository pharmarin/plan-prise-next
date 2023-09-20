"use client";
// Because of the use of react-pdf

import dynamic from "next/dynamic";

const ShowPDF: React.FC<{ file: string }> = ({ file }) => {
  const Document = dynamic(
    () => import("react-pdf").then((imported) => imported.Document),
    { ssr: false },
  );

  const Page = dynamic(
    () => import("react-pdf").then((imported) => imported.Page),
    { ssr: false },
  );

  return (
    <Document file={file}>
      <Page pageNumber={1} />
    </Document>
  );
};
export default ShowPDF;
