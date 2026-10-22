import {
  arrayRemove, arrayUnion, collection, doc, getDocs, limit,
  query, serverTimestamp, updateDoc, where, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { safeWrite } from "@/lib/errors";

function codedError(code) {
  return Object.assign(new Error(code), { code });
}

async function findUserByEmail(email) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email.trim().toLowerCase()),
    limit(1)
  );
  const snap = await getDocs(q);
  // Offline, Firestore may answer from an empty cache: that is not "user not found".
  if (snap.metadata.fromCache) throw codedError("unavailable");
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { uid: d.id, ...d.data() };
}

export async function addMemberByEmail(project, email) {
  const found = await safeWrite(() => findUserByEmail(email));
  if (!found) throw codedError("member/not-found");
  if (project.memberIds.includes(found.uid)) throw codedError("member/duplicate");

  await safeWrite(() =>
    updateDoc(doc(db, "projects", project.id), {
      memberIds: arrayUnion(found.uid),
      updatedAt: serverTimestamp(),
    })
  );
  return found;
}

// Unassign the member's tasks first, then revoke access.
export function removeMember(projectId, uid) {
  return safeWrite(async () => {
    const assigned = query(
      collection(db, "projects", projectId, "tasks"),
      where("assigneeId", "==", uid)
    );
    const snap = await getDocs(assigned);
    const refs = snap.docs.map((d) => d.ref);

    for (let i = 0; i < refs.length; i += 400) {
      const batch = writeBatch(db);
      refs.slice(i, i + 400).forEach((ref) =>
        batch.update(ref, { assigneeId: null, updatedAt: serverTimestamp() })
      );
      await batch.commit();
    }

    await updateDoc(doc(db, "projects", projectId), {
      memberIds: arrayRemove(uid),
      updatedAt: serverTimestamp(),
    });
  }, 30000);
}