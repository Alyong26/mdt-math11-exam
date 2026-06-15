"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return sessionStorage.getItem("examToken");
}

function getServerSnapshot() {
  return null;
}

export function useExamToken() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
