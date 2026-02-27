import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return NextResponse.json(null, { status: 401 });
  }

  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: {
      Cookie: `auth_token=${authToken.value}`,
    },
  });

  if (!res.ok) return NextResponse.json(null, { status: 401 });

  return NextResponse.json(await res.json());
}
