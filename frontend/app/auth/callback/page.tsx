import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = searchParams.code;

  if (code) {
    // Exchange code for token (server-to-server, internal network)
    const res = await fetch(`${process.env.API_URL}/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const { token } = await res.json();

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }
  }

  redirect("/dashboard");
}
