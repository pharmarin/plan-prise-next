"use client";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const ShowPDF: React.FC<{ file: string }> = ({ file }) => {
  return (
    <Document className="w-fit overflow-hidden rounded-lg border" file={file}>
      <Page pageNumber={1} />
    </Document>
  );
};

export default ShowPDF;
