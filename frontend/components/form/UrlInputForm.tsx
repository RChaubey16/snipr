"use client";

import Link from "next/link";
import { useState } from "react";
import { InputField } from "../input/InputField";
import { Button } from "../ui/button";
import { createSniprUrl } from "@/lib/actions";

const UrlInputForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [errors, setErrors] = useState([]);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await createSniprUrl(longUrl);

      if (!res.success) {
        setErrors(res.error ?? ["Something went wrong"]);
      }

      setLongUrl("");
      setShortUrl(`${process.env.NEXT_PUBLIC_API_URL}/${res.data.shortUrl}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onFormSubmit} className="flex items-end gap-2">
        <InputField
          label="Long URL"
          id="long-url"
          type="text"
          placeholder="Your long URL"
          showDescription={false}
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button
          variant="outline"
          size="default"
          type="submit"
          className="cursor-pointer"
        >
          Snipe
        </Button>
      </form>

      {/* Error messages TODO: Update UI later */}
      {errors.length > 0 && (
        <div className="px-4 py-2 rounded-md bg-black/10">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {shortUrl && (
        <div className="px-4 py-2 rounded-md bg-black/10">
          Your snipr link:{" "}
          <Link href={shortUrl ?? "#"} target="_blank" className="underline">
            {shortUrl}
          </Link>
        </div>
      )}
    </div>
  );
};

export default UrlInputForm;
