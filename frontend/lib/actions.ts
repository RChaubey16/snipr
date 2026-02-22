"use server";

export async function createSniprUrl(url: string) {
  try {
    const payload = { url: url };

    console.log("ENV", process.env.API_URL)

    const response = await fetch(`${process.env.API_URL}/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store", // optional but recommended for server actions
    });

    const result = await response.json();
    console.log("Result", result)

    if (result?.error) {
      return { success: false, error: result?.message };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: ["Server connection failed"] };
  }
}
