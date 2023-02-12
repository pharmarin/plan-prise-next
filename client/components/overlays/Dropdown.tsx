"use client";

import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

const Dropdown: React.FC<{
  buttonContent: React.ReactElement | string;
  buttonProps?: any;
  className?: string;
  items: ({ label: string } & ({ path: string } | { action: () => void }))[];
}> = ({ buttonContent, buttonProps, className, items }) => {
  return (
    <Menu>
      {({ open }) => (
        <div className={twMerge("relative z-10", className)}>
          <Menu.Button {...buttonProps}>{buttonContent}</Menu.Button>
          <Transition
            show={open || false}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="divide-y-1 absolute right-0 mt-2 w-full min-w-fit origin-top-right divide-gray-300 overflow-hidden rounded-md bg-white shadow-lg">
              {(items || []).map((item, index) => (
                <Menu.Item key={index}>
                  {({ active }) =>
                    "path" in item ? (
                      <Link
                        className={twMerge(
                          "block w-full px-4 py-2 text-sm font-medium normal-case tracking-normal text-gray-700 hover:bg-gray-100",
                          active && "bg-teal-200"
                        )}
                        href={item.path}
                      >
                        {item.label}
                      </Link>
                    ) : "action" in item ? (
                      <button
                        className={twMerge(
                          "block w-full px-4 py-2 text-sm font-medium normal-case tracking-normal text-gray-700 hover:bg-gray-100",
                          active && "bg-teal-200"
                        )}
                        onClick={item.action}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <></>
                    )
                  }
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
};

export default Dropdown;
