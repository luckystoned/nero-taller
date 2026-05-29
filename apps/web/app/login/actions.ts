"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("Ingresá un email válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
  next: z.string().optional(),
});

function buildLoginRedirect(message: string, next?: string) {
  const params = new URLSearchParams({ error: message });

  if (next) {
    params.set("next", next);
  }

  return `/login?${params.toString()}`;
}

function getSafeRedirectPath(path?: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  if (path.startsWith("/login")) {
    return "/dashboard";
  }

  return path;
}

export async function loginAction(formData: FormData) {
  const requestedNext =
    typeof formData.get("next") === "string"
      ? formData.get("next")?.toString()
      : undefined;

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: requestedNext,
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const message =
      fieldErrors.email?.[0] ??
      fieldErrors.password?.[0] ??
      "Revisá los datos ingresados.";

    redirect(buildLoginRedirect(message, getSafeRedirectPath(requestedNext)));
  }

  const supabase = await createClient();
  const nextPath = getSafeRedirectPath(parsed.data.next);

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirect(
      buildLoginRedirect("No pudimos iniciar sesión con esos datos.", nextPath),
    );
  }

  redirect(nextPath);
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
