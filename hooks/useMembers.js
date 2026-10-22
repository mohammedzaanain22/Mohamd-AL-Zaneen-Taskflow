"use client";
import { useEffect, useState } from "react";
import { getUserProfiles } from "@/services/users";

export function useMembers(memberIds) {
  const key = memberIds ? [...memberIds].sort().join(",") : "";
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    getUserProfiles(key.split(","))
      .then((list) => !cancelled && setMembers(list))
      .catch(() => !cancelled && setMembers([]));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return members;
}