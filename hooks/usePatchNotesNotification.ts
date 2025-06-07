import { useEffect, useState } from "react";
import { patchNotes } from "@/data/patchNotes";

export function usePatchNotesNotification() {
  const [hasNewPatchNotes, setHasNewPatchNotes] = useState(false);

  useEffect(() => {
    // Get the latest patch note version
    const latestVersion = patchNotes[0]?.version;

    if (!latestVersion) {
      setHasNewPatchNotes(false);
      return;
    }

    // Check if user has seen this version
    const lastSeenVersion = localStorage.getItem("lastSeenPatchVersion");

    // If no version stored or different version, show notification
    if (!lastSeenVersion || lastSeenVersion !== latestVersion) {
      setHasNewPatchNotes(true);
    } else {
      setHasNewPatchNotes(false);
    }
  }, []);

  const markPatchNotesAsSeen = () => {
    const latestVersion = patchNotes[0]?.version;
    if (latestVersion) {
      localStorage.setItem("lastSeenPatchVersion", latestVersion);
      setHasNewPatchNotes(false);
    }
  };

  return {
    hasNewPatchNotes,
    markPatchNotesAsSeen,
  };
} 