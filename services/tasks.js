import {
  addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { safeWrite } from "@/lib/errors";

function tasksCollection(projectId) {
  return collection(db, "projects", projectId, "tasks");
}

export function subscribeToTasks(projectId, onData, onError) {
  return onSnapshot(
    tasksCollection(projectId),
    (snap) =>
      onData(
        snap.docs.map((d) => ({
          ...d.data({ serverTimestamps: "estimate" }),
          id: d.id,
          projectId,
        }))
      ),
    onError
  );
}

export function createTask(projectId, values, user) {
  return safeWrite(() =>
    addDoc(tasksCollection(projectId), {
      title: values.title,
      description: values.description,
      status: "todo",
      priority: values.priority,
      assigneeId: values.assigneeId ?? null,
      dueDate: values.dueDate ?? null,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
}

export function updateTask(projectId, taskId, changes) {
  return safeWrite(() =>
    updateDoc(doc(db, "projects", projectId, "tasks", taskId), {
      ...changes,
      updatedAt: serverTimestamp(),
    })
  );
}

export function deleteTask(projectId, taskId) {
  return safeWrite(() => deleteDoc(doc(db, "projects", projectId, "tasks", taskId)));
}