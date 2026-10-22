"use client";
import { useEffect, useState } from "react";
import { subscribeToProject } from "@/services/projects";

// error: null | "denied" | "not-found" | "failed"
export function useProject(projectId) {
  const [state, setState] = useState({ project: null, loading: true, error: null });

  useEffect(() => {
    return subscribeToProject(
      projectId,
      (project) =>
        setState({ project, loading: false, error: project ? null : "not-found" }),
      (err) =>
        setState({
          project: null,
          loading: false,
          error: err.code === "permission-denied" ? "denied" : "failed",
        })
    );
  }, [projectId]);

  return state;
}