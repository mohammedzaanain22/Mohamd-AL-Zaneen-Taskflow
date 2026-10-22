export function getFirestoreErrorMessage(error) {
  switch (error?.code) {
    case "permission-denied":
      return "Access denied. You don't have permission to do this.";
    case "unavailable":
      return "Network error. Check your connection and try again.";
    case "not-found":
      return "This item no longer exists.";
          case "member/not-found":
      return "No registered user has this email address.";
    case "member/duplicate":
      return "This user is already a member of this project.";
    default:
      return "Something went wrong. Try again.";
  }
}

function networkError() {
  return Object.assign(new Error("Network unavailable"), { code: "unavailable" });
}

// Runs a Firestore write and turns "silently waiting" into a visible error.
export async function safeWrite(operation, timeoutMs = 10000) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw networkError();
  }
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(networkError()), timeoutMs);
  });
  try {
    return await Promise.race([operation(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}