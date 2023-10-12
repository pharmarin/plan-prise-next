import { Text, View } from "@react-pdf/renderer";
import type { PropsWithChildren } from "react";
import { createTw } from "react-pdf-tailwind";
import { twMerge } from "tailwind-merge";

const tw = createTw({});

export const Table = ({ children }: PropsWithChildren) => (
  <View style={tw("flex w-auto border border-solid border-r-0 border-b-0")}>
    {children}
  </View>
);

export const Row = ({ children }: PropsWithChildren) => (
  <View style={tw("w-full m-auto flex-row justify-start")}>{children}</View>
);

export const Col = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => (
  <View
    style={[
      tw(
        twMerge(
          "flex-1 border border-solid border-l-0 border-t-0 p-1 text-base items-start",
          className,
        ),
      ),
      { lineHeight: 1 },
    ]}
  >
    {children}
  </View>
);

const Line = ({
  alignLeft,
  bold,
  children,
  className,
  italic,
}: {
  alignLeft?: boolean;
  children: string;
  className?: string;
  bold?: boolean;
  italic?: boolean;
}) => (
  <Text
    style={[
      tw(twMerge("m-auto", alignLeft && "ml-0", className)),
      {
        fontFamily:
          bold && italic
            ? "Helvetica-BoldOblique"
            : bold
            ? "Helvetica-Bold"
            : italic
            ? "Helvetica-Oblique"
            : "Helvetica",
      },
    ]}
  >
    {children}
  </Text>
);

export const Header = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <Col className={className}>
    <Line bold className="m-auto py-1">
      {children}
    </Line>
  </Col>
);

export const Cell = ({
  alignLeft,
  alignTop,
  children,
  className,
  ...props
}: (
  | { children: string; bold?: boolean }
  | {
      children: {
        text: string;
        bold?: boolean;
        italic?: boolean;
        className?: string;
      }[];
    }
) & {
  alignLeft?: boolean;
  alignTop?: boolean;
  className?: string;
}) => (
  <Col className={twMerge(alignTop && "items-start", className)}>
    {Array.isArray(children) ? (
      children.map((line, key) => (
        <Line
          key={key}
          alignLeft={alignLeft}
          bold={line.bold}
          italic={line.italic}
          className={line.className}
        >
          {line.text}
        </Line>
      ))
    ) : (
      <Line alignLeft={alignLeft} bold={"bold" in props && props.bold}>
        {children}
      </Line>
    )}
  </Col>
);
