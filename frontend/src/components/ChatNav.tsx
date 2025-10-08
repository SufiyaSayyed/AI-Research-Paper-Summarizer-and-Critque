import { cn } from "@/lib/utils";
import type { ChatNavProps } from "@/types";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Folder, MessageSquareText } from "lucide-react";

const ChatNav: React.FC<ChatNavProps> = ({ setIsOpen, showText = false }) => {
  const location = useLocation();

  const links = [
    { to: "/chat", label: "Chat", icon: MessageSquareText },
    { to: "/dashboard", label: "References", icon: Folder },
  ];

  return (
    <>
      {links.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            "flex items-center gap-3 rounded-lg transition-colors",
            showText ? "px-3 py-2" : "p-3 justify-center",
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
    </>
  );
};

export default ChatNav;
