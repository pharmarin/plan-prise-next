import type { ReactNode } from "react";
import Logo from "@/components/navigation/Logo";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

const ErrorSkeleton = ({
  action,
  logo,
  subtitle,
  title,
}: {
  logo?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => {
  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="flex flex-1 items-center justify-center rounded-lg bg-white">
        <div className="flex divide-x">
          <div className="flex items-center pr-4">{logo ?? <Logo />}</div>
          <div className="space-y-2 pl-4">
            <TypographyH1>{title}</TypographyH1>
            <TypographyMuted>{subtitle}</TypographyMuted>
            <div className="pt-2">{action}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorSkeleton;
