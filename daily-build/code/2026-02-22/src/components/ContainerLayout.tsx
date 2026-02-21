import { ReactNode } from "react";

interface ContainerLayoutProps {
  children: ReactNode;
}

function ContainerLayout({ children }: ContainerLayoutProps) {
  return <main className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-8 sm:px-6">{children}</main>;
}

export default ContainerLayout;
