import { cn } from "@/lib/utils";
import type { ChatNavProps } from "@/types";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Folder, LogOut, MessageSquareText } from "lucide-react";
import { useLogoutMutation } from "@/hooks/queriesAndMutation";

const ChatNav: React.FC<ChatNavProps> = ({ setIsOpen, showText = false }) => {
  const location = useLocation();
  const { mutate } = useLogoutMutation();

  const links = [
    { to: "/upload", label: "Chat", icon: MessageSquareText },
    { to: "/dashboard", label: "References", icon: Folder },
  ];

  const handleLogout = async () => {
    mutate();
  };

  return (
    <div>
      {links.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            "flex items-center gap-3 rounded-lg transition-colors mb-2",
            showText ? "px-3 py-2" : "p-2 justify-center",
            location.pathname === to
              ? "bg-palette-1 text-white"
              : "hover:bg-palette-7 text-gray-600"
          )}
          onClick={() => setIsOpen(false)}
        >
          <Icon
            size={22}
            className={cn(
              "transition-colors",
              location.pathname === to
                ? "text-white"
                : "text-gray-700 group-hover:text-black"
            )}
          />
          {showText && <span className="font-medium">{label}</span>}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 justify-center rounded-lg transition-colors p-2 mb-4 fixed bottom-0 left-0 right-0 md:left-auto md:right-auto hover:bg-palette-7 text-gray-600"
      >
        <LogOut size={22} className="transition-color text-gray-700" />
        <p className="md:hidden">Logout</p>
      </button>
    </div>
  );
};

export default ChatNav;
