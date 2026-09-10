import type { ReactNode } from "react";

import { Shell } from "@panel/components/Shell";

export default function LayoutPanel({ children }: { children: ReactNode }) {
  return (
    <Shell>
      <main className="mx-auto max-w-[1440px] px-5 py-7 lg:px-8">{children}</main>
    </Shell>
  );
}
