"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { getUserLikes } from "@/app/actions";

interface SessionState {
  username: string | null;
  isReady: boolean;
  upvotedIds: string[];
  savedIds: string[];
  login: (name: string) => void;
  logout: () => void;
  toggleUpvote: (id: string, isUpvoted: boolean) => void;
  toggleSave: (id: string, isSaved: boolean) => void;
  hasUpvoted: (id: string) => boolean;
  hasSaved: (id: string) => boolean;
  setReady: (username: string | null, upvotedIds: string[], savedIds: string[]) => void;
  syncUpvotes: (upvotedIds: string[]) => void;
}

const useSessionStore = create<SessionState>((set, get) => ({
  username: null,
  isReady: false,
  upvotedIds: [],
  savedIds: [],
  setReady: (username, upvotedIds, savedIds) => {
    set({ username, upvotedIds, savedIds, isReady: true });
  },
  syncUpvotes: (upvotedIds) => {
    localStorage.setItem("paradise_upvotes", JSON.stringify(upvotedIds));
    set({ upvotedIds });
  },
  login: async (name) => {
    localStorage.setItem("paradiseNickname", name);
    set({ username: name });
    // Fetch user likes from the server on login
    const res = await getUserLikes(name);
    if (res.success) {
      const allLikes = [...(res.postLikes || []), ...(res.commentLikes || [])];
      get().syncUpvotes(allLikes);
    }
  },
  logout: () => {
    localStorage.removeItem("paradiseNickname");
    localStorage.removeItem("paradise_upvotes");
    localStorage.removeItem("paradise_saved");
    set({ username: null, upvotedIds: [], savedIds: [] });
  },
  toggleUpvote: (id, isUpvoted) => {
    const { upvotedIds } = get();
    const next = isUpvoted
      ? [...new Set([...upvotedIds, id])]
      : upvotedIds.filter(i => i !== id);
    localStorage.setItem("paradise_upvotes", JSON.stringify(next));
    set({ upvotedIds: next });
  },
  toggleSave: (id, isSaved) => {
    const { savedIds } = get();
    const next = isSaved
      ? [...new Set([...savedIds, id])]
      : savedIds.filter(i => i !== id);
    localStorage.setItem("paradise_saved", JSON.stringify(next));
    set({ savedIds: next });
  },
  hasUpvoted: (id) => get().upvotedIds.includes(id),
  hasSaved: (id) => get().savedIds.includes(id),
}));

export function useSession() {
  const store = useSessionStore();

  useEffect(() => {
    if (store.isReady) return;

    let storedUsername = null;
    let storedUpvotes: string[] = [];
    let storedSaved: string[] = [];

    const stored = localStorage.getItem("paradiseNickname");
    if (stored) storedUsername = stored;

    const storedUpvotesStr = localStorage.getItem("paradise_upvotes");
    if (storedUpvotesStr) {
      try {
        storedUpvotes = JSON.parse(storedUpvotesStr);
      } catch (e) { }
    }

    const storedSavedStr = localStorage.getItem("paradise_saved");
    if (storedSavedStr) {
      try {
        storedSaved = JSON.parse(storedSavedStr);
      } catch (e) { }
    }

    store.setReady(storedUsername, storedUpvotes, storedSaved);

    // Sync likes from server to ensure local storage is up-to-date
    if (storedUsername) {
      getUserLikes(storedUsername).then(res => {
        if (res.success) {
          const allLikes = [...(res.postLikes || []), ...(res.commentLikes || [])];
          store.syncUpvotes(allLikes);
        }
      });
    }
  }, [store.isReady, store.setReady, store.syncUpvotes]);

  return store;
}
