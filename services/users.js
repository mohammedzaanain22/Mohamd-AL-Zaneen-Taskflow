import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getUserProfiles(uids) {
  const snaps = await Promise.all(uids.map((uid) => getDoc(doc(db, "users", uid))));
  return snaps.filter((s) => s.exists()).map((s) => ({ uid: s.id, ...s.data() }));
}