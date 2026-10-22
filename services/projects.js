import {
  addDoc, collection, deleteDoc, doc, getDocs, onSnapshot,
  query, serverTimestamp, updateDoc, where, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { safeWrite } from "@/lib/errors";

function toProject(snapshot) {
  return { id: snapshot.id, ...snapshot.data({ serverTimestamps: "estimate" }) };
}

export async function createProject({ name, description }, user) {
  const ref = await safeWrite(() =>
    addDoc(collection(db, "projects"), {
      name,
      description,
      ownerId: user.uid,
      memberIds: [user.uid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
  return ref.id;
}

export function subscribeToProjects(uid, onData, onError) {
  const q = query(collection(db, "projects"), where("memberIds", "array-contains", uid));
  return onSnapshot(q, (snap) => onData(snap.docs.map(toProject)), onError);
}

export function subscribeToProject(projectId, onData, onError) {
  return onSnapshot(
    doc(db, "projects", projectId),
    (snap) => onData(snap.exists() ? toProject(snap) : null),
    onError
  );
}

export function updateProject(projectId, { name, description }) {
  return safeWrite(() =>
    updateDoc(doc(db, "projects", projectId), {
      name,
      description,
      updatedAt: serverTimestamp(),
    })
  );
}

// Firestore does not cascade deletes: delete the tasks first, then the project.
// Tasks go first because the task rules read the parent project, which must still exist.
export function deleteProject(projectId) {
  return safeWrite(async () => {
    const snap = await getDocs(collection(db, "projects", projectId, "tasks"));
    const refs = snap.docs.map((d) => d.ref);
    for (let i = 0; i < refs.length; i += 400) {
      const batch = writeBatch(db);
      refs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
    await deleteDoc(doc(db, "projects", projectId));
  }, 30000);
}