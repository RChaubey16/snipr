"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getMyUrls(page: number = 1, limit: number = 10) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  const response = await fetch(`${process.env.API_URL}/url/my-urls?page=${page}&limit=${limit}`, {
    headers: {
      ...(authToken && { Cookie: `auth_token=${authToken.value}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) return [];

  return response.json();
}

export async function getMyStats() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  const response = await fetch(`${process.env.API_URL}/url/stats`, {
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

export async function deleteUrl(id: string) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  const response = await fetch(`${process.env.API_URL}/url/${id}`, {
    method: "DELETE",
    headers: {
      ...(authToken && { Cookie: `auth_token=${authToken.value}` }),
    },
  });

  if (!response.ok) {
    return { success: false };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
