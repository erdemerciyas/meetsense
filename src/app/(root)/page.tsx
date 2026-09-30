import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "MeetSense" };

export default function RootRedirect() {
  return (
    <main className="shell py-24">
      <meta httpEquiv="refresh" content="0;url=/tr/" />
      <Link className="text-link" href="/tr/">
        MeetSense
      </Link>
    </main>
  );
}
