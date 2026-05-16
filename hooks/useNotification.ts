"use client"; // Ensure this is a client component

import { useEffect } from "react";

export const useNotification = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Notifications Enabled!", {
            body: "You will receive updates.",
          });
        }
      });
    }
  }, []);
};
