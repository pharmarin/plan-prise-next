import { useEffect } from "react";

export const useEventListener = (
  eventName: string,
  eventAction: () => void,
) => {
  useEffect(() => {
    document.addEventListener(eventName, eventAction);

    return () => document.removeEventListener(eventName, eventAction);
  }, [eventName, eventAction]);
};
