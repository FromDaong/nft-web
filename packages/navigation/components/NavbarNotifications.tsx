import { LightningBoltIcon } from "@heroicons/react/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import * as Avatar from "@radix-ui/react-avatar";
import { DropdownContainer, DropdownContent } from "./DropdownContainer";

const NavbarNotifications = ({
  notifications,
}: {
  notifications: Array<any>;
}) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <div className="flex items-center justify-center w-10 h-10 bg-white border rounded-full drop-shadow-sm shadow-pink-500/20">
        <LightningBoltIcon className="w-5 h-5" />
      </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownContent>
        <DropdownContainer>
          <DropdownMenu.Label className="px-3 py-2 text-xl font-medium text-gray-800 ">
            <h3>Notifications</h3>
          </DropdownMenu.Label>
          <DropdownMenu.Group>
            {notifications.length > 0 ? (
              <div className="grid">
                {notifications.map((notification) => (
                  <div
                    className="flex justify-between px-2 py-4 rounded-lg hover:bg-gray-100 hover:cursor-pointer"
                    key={notification.url + notification.timestamp}
                  >
                    <div className="flex gap-x-4">
                      <div className="h-auto">
                        <Avatar.Root className="rounded-full shadow bg-gray-50">
                          <Avatar.Image
                            className="object-cover w-10 h-10 rounded-full shadow-md"
                            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                          />
                          <Avatar.Fallback className="rounded-full shadow-xl ">
                            <p className="flex items-center justify-center w-10 h-10 font-medium bg-white border rounded-full drop-shadow-sm shadow-pink-500/10 text-slate-700">
                              TR
                            </p>
                          </Avatar.Fallback>
                        </Avatar.Root>
                      </div>
                      <div className="flex-1">
                        <p>
                          <span className="font-medium">
                            @{notification.actor}
                          </span>{" "}
                          {notification.text}
                        </p>
                        <p className="mt-2 text-xs font-medium text-purple-400">
                          {Intl.DateTimeFormat().format(
                            new Date(notification.timestamp)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No notifications yet</p>
            )}
          </DropdownMenu.Group>
        </DropdownContainer>
      </DropdownContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default NavbarNotifications;
