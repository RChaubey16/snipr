"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getMyUrls() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  const response = await fetch(`${process.env.API_URL}/url/my-urls`, {
    headers: {
      ...(authToken && { Cookie: `auth_token=${authToken.value}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) return [];

  return response.json();
}

export async function createSniprUrl(url: string) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    const response = await fetch(`${process.env.API_URL}/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Cookie: `auth_token=${authToken.value}` }),
      },
      body: JSON.stringify({ url }),
      cache: "no-store",
    });

    const result = await response.json();

    if (result?.error) {
      return { success: false, error: result?.message };
    }

    if (authToken) {
      revalidatePath("/dashboard");
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: ["Server connection failed"] };
  }
}
