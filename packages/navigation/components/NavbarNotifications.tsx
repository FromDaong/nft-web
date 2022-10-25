import { LightningBoltIcon } from "@heroicons/react/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

const notifications = [
  {
    text: "@hitta followed you",
    timestamp: Date.now(),
    url: "/c/hitta",
    audience: ["tate2301"],
  },
  {
    text: "@hitta followed you",
    timestamp: Date.now(),
    url: "/c/hitta",
    audience: ["tate2301"],
  },
];

const NavbarNotifications = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <div className="flex items-center justify-center w-10 h-10 bg-white border rounded-full drop-shadow-sm shadow-pink-500/20">
        <LightningBoltIcon className="w-5 h-5" />
      </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="z-50 w-64 bg-white min-w-[256px] divide-y shadow-xl gap-y-3 rounded-xl">
        <DropdownMenu.Label className="px-3 py-2 text-sm text-gray-400 ">
          Notifications
        </DropdownMenu.Label>
        <DropdownMenu.Group className="py-2 text-sm">
          {notifications.length > 0 ? (
            <div className="grid divide-y">
              {notifications.map((notification) => (
                <div
                  className="px-3 py-2"
                  key={notification.url + notification.timestamp}
                >
                  <Link href={notification.url}>
                    <a>
                      <p>{notification.text}</p>
                      <p className="text-sm text-gray-400 ">
                        {Intl.DateTimeFormat().format(
                          new Date(notification.timestamp)
                        )}
                      </p>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No notifications yet</p>
          )}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarNotifications;
