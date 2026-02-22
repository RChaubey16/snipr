"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { InputField } from "../input/InputField";
import { Button } from "../ui/button";
import { createSniprUrl } from "@/lib/actions";
import { CircleArrowRight } from "lucide-react";

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
    <motion.div
      initial={{ filter: "blur(10px)", scale: 0.98, opacity: 0 }}
      animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
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
          type="submit"
          className="cursor-pointer"
        >
          Snipe
          <CircleArrowRight />
        </Button>
      </form>

      {/* Error messages TODO: Update UI later */}
      {errors.length > 0 && (
        <div className="px-4 py-2 rounded-md">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {shortUrl && (
        <div className="px-4 py-2 rounded-md bg-primary/20 text-accent-foreground">
          Your snipr link:{" "}
          <Link href={shortUrl ?? "#"} target="_blank" className="underline">
            {shortUrl}
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default UrlInputForm;
