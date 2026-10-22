"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { subscribeToProjects } from "@/services/projects";
import { getFirestoreErrorMessage } from "@/lib/errors";
import { sortNewest } from "@/lib/utils";

export function useProjects() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [state, setState] = useState({ projects: [], loading: true, error: "" });

  useEffect(() => {
    if (!uid) return;
    return subscribeToProjects(
      uid,
      (projects) => setState({ projects: sortNewest(projects), loading: false, error: "" }),
      (err) => setState({ projects: [], loading: false, error: getFirestoreErrorMessage(err) })
    );
  }, [uid]);

  return state;
}