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

  return <PDFViewer className="h-screen w-full" {...props} />;
};

export default ViewPDF;
