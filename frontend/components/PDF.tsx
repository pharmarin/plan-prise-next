import { Text, View } from "@react-pdf/renderer";
import type { PropsWithChildren } from "react";
import { createTw } from "react-pdf-tailwind";
import { twMerge } from "tailwind-merge";

const tw = createTw({});

export const Table = ({
  children,
  className,
  fixed,
}: PropsWithChildren & { className?: string; fixed?: boolean }) => (
  <View
    style={tw(
      twMerge(
        "h-auto w-auto border border-solid border-r-0 border-b-0",
        className
      )
    )}
    fixed={fixed}
  >
    {children}
  </View>
);

export const Row = ({ children }: PropsWithChildren) => (
  <View style={tw("w-full m-auto mt-0 flex-row")}>{children}</View>
);

export const Col = ({
  children,
  className,
  wrap,
}: PropsWithChildren & { className?: string; wrap?: boolean }) => (
  <View
    style={[
      tw(
        twMerge(
          "flex-1 border border-solid border-l-0 border-t-0 p-1 text-base",
          className
        )
      ),
      { lineHeight: 1 },
    ]}
    wrap={wrap}
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
  wrap,
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
  wrap?: boolean;
}) => (
  <Col className={twMerge(alignTop && "items-start", className)} wrap={wrap}>
    {Array.isArray(children) ? (
      <View style={tw("mb-auto")}>
        {children.map((line, key) => (
          <Line
            key={key}
            alignLeft={alignLeft}
            bold={line.bold}
            italic={line.italic}
            className={twMerge(key !== 0 && "mt-2", line.className)}
          >
            {line.text}
          </Line>
        ))}
      </View>
    ) : (
      <Line alignLeft={alignLeft} bold={"bold" in props && props.bold}>
        {children}
      </Line>
    )}
  </Col>
);
