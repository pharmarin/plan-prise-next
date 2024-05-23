import type { ReactNode } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const CommonPdf = ({
  children,
  header,
  footer,
  orientation = "landscape",
  pageWrap,
}: {
  children: ReactNode;
  header: string;
  footer: string;
  orientation?: "landscape" | "portrait";
  pageWrap?: boolean;
}) => {
  const tw = createTw({});

  return (
    <Document>
      <Page
        orientation={orientation}
        size="A4"
        style={tw("p-8 pb-16 relative")}
        wrap={pageWrap}
      >
        <View fixed>
          <View>
            <Text
              style={[
                tw("text-sm text-gray-800"),
                {
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              {header}
            </Text>
            <Text
              style={[
                tw("text-sm text-gray-800 mb-1"),
                {
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              Ceci n&apos;est pas une ordonnance.
            </Text>
          </View>
        </View>
        <Text
          style={tw("text-sm text-gray-800 absolute bottom-6 left-8")}
          fixed
        >
          {footer}
        </Text>
        <Text
          style={tw("text-sm text-gray-800 absolute bottom-6 right-8")}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} sur ${totalPages}`
          }
          fixed
        />
        {children}
      </Page>
    </Document>
  );
};

export default CommonPdf;
