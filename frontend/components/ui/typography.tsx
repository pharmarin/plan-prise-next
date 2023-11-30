import type { ReactNode } from "react";

export const TypographyH1 = ({ children }: { children: ReactNode }) => (
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
    {children}
  </h1>
);

export const TypographyH2 = ({ children }: { children: ReactNode }) => (
  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    {children}
  </h2>
);

export const TypographyH3 = ({ children }: { children: ReactNode }) => (
  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
    {children}
  </h3>
);

export const TypographyH4 = ({ children }: { children: ReactNode }) => (
  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
    {children}
  </h4>
);

export const TypographyP = ({ children }: { children: ReactNode }) => (
  <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
);

export const TypographyBlockquote = ({ children }: { children: ReactNode }) => (
  <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
);

export const TypographySmall = ({ children }: { children: ReactNode }) => (
  <small className="text-sm font-medium leading-none">{children}</small>
);

export const TypographyMuted = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);
