import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  const claims = data.claims as { email?: unknown };
  const userEmail = typeof claims.email === "string" ? claims.email : undefined;

  return <AppShell userEmail={userEmail}>{children}</AppShell>;
}
