"use client";
import { useEffect, useMemo, useState } from "react";
import { subscribeToTasks } from "@/services/tasks";
import { getFirestoreErrorMessage } from "@/lib/errors";
import { sortNewest } from "@/lib/utils";

export function useTasks(projectId, enabled) {
  const [state, setState] = useState({ tasks: [], loading: true, error: "" });

  
  useEffect(() => {
    
    if (!enabled) return;
    return subscribeToTasks(
      projectId,
      (tasks) => setState({ tasks: sortNewest(tasks), loading: false, error: "" }),
      (err) => setState({ tasks: [], loading: false, error: getFirestoreErrorMessage(err) })
    );
  }, [projectId, enabled]);

  return state;
}

export function useAllTasks(projects) {
  const key = projects.map((p) => p.id).sort().join(",");
  const ids = useMemo(() => (key ? key.split(",") : []), [key]);
  const [byProject, setByProject] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const unsubscribers = ids.map((id) =>
      subscribeToTasks(
        id,
        (tasks) => {
          setByProject((prev) => ({ ...prev, [id]: tasks }));
          setErrors((prev) => (prev[id] ? { ...prev, [id]: "" } : prev));
        },
        (err) => {
          setByProject((prev) => ({ ...prev, [id]: [] }));
          setErrors((prev) => ({ ...prev, [id]: getFirestoreErrorMessage(err) }));
        }
      )
    );
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [ids]);

  const tasks = useMemo(() => ids.flatMap((id) => byProject[id] ?? []), [ids, byProject]);
  const loading = ids.some((id) => byProject[id] === undefined);
  const error = ids.map((id) => errors[id]).find(Boolean) ?? "";

  return { tasks, loading, error };
}