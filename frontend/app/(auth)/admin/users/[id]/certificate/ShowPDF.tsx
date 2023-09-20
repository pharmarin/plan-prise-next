"use client";
// Because of the use of react-pdf

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const ShowPDF: React.FC<{ file: string }> = ({ file }) => {
  return (
    <Document file={file}>
      <Page pageNumber={1} />
    </Document>
  );
};

export default ShowPDF;
