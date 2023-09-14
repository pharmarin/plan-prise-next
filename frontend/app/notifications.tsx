"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { createId } from "@paralleldrive/cuid2";
import { useEffect, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Notification = {
  id: string;
  type: "success" | "error";
  text: string;
  timer?: number;
};

type State = { notifications: Notification[] };

type Actions = {
  addNotification: (notification: Notification) => void;
  removeNotification: (id: Notification["id"]) => void;
};

export const createNotification = (notification: Omit<Notification, "id">) => ({
  id: createId(),
  ...notification,
});

const useNotificationsStore = create(
  immer<State & Actions>((setState) => ({
    notifications: [],
    addNotification: (notification: Notification) =>
      setState((state) => {
        state.notifications.push(notification);
      }),
    removeNotification: (id: Notification["id"]) =>
      setState((state) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== id,
        );
      }),
  })),
);

const Notification = ({ notification }: { notification: Notification }) => {
  const removeNotification = useNotificationsStore(
    (state) => state.removeNotification,
  );

  useEffect(() => {
    if (notification.timer) {
      const timer = setTimeout(
        () => removeNotification(notification.id),
        notification.timer,
      );

      return () => clearTimeout(timer);
    }
  });

  return (
    <div
      key={notification.id}
      className="flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow"
      role="alert"
    >
      <div
        className={twMerge(
          "inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          notification.type === "success" && "bg-green-100 text-green-500",
          notification.type === "error" && "bg-red-100 text-red-500",
        )}
      >
        {notification.type === "success" && <CheckIcon className="h-4 w-4" />}
        {notification.type === "error" && <XMarkIcon className="h-4 w-4" />}
      </div>
      <div className="ml-3 text-sm font-normal">{notification.text}</div>
      {!notification.timer && (
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
          onClick={() => removeNotification(notification.id)}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notifications = useNotificationsStore((state) => state.notifications);

  return (
    <>
      <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col items-end justify-start space-y-4 p-4">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
      {children}
    </>
  );
};

export default useNotificationsStore;
