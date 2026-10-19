import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// A form cannot navigate with entered data before React attaches its handlers.
export function useFormReady() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
