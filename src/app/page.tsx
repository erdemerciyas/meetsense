"use client";

import { useEffect } from "react";
import { defaultLocale } from "@/lib/i18n";

export default function HomePage() {
  useEffect(() => {
    window.location.replace(`/${defaultLocale}/`);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-muted">
      <p className="text-sm">Yönlendiriliyor...</p>
    </main>
  );
}
