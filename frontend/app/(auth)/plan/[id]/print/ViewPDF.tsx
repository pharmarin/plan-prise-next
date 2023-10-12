"use client";

import type ReactPDF from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const ViewPDF = (props: ReactPDF.PDFViewerProps) => {
  const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((imp) => imp.PDFViewer),
    {
      ssr: false,
    },
  );

  return <PDFViewer {...props} />;
};

export default ViewPDF;
