import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  console.log("Auth callback hit, code:", code);

  if (code) {
    const res = await fetch(`${process.env.API_URL}/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    console.log("Exchange response status:", res.status);

    const data = await res.json();
    console.log("Exchange response data:", data);

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      console.log("Cookie set successfully");
    }
  }

  redirect("/dashboard");
}
