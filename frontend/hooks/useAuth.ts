"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
  //     credentials: "include", // sends cookies with request
  //   })
  //     .then((res) => (res.ok ? res.json() : null))
  //     .then((data) => setUser(data))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    fetch(`/api/auth/me`) // no credentials needed, same domain
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  //   const logout = async () => {
  //   await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
  //     method: "POST",
  //     credentials: "include",
  //   });
  //   setUser(null);
  // };

  const logout = async () => {
    await fetch(`/api/auth/logout`, { method: "POST" });
    setUser(null);
  };

  return { user, loading, isAuthenticated: !!user, logout };
}
