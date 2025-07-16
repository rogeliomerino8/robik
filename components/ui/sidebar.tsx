"use client";

import Image from "next/image";
import { Home, FileText, BarChart2, MessageCircle, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const navItems = [
  { label: "Documentos", icon: FileText, href: "/" },
  { label: "Análisis", icon: BarChart2, href: "/analisis" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Alertas", icon: Bell, href: "/alertas" },
];

type NavItem = typeof navItems[number];

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState<string>("/");

  const handleNav = (href: string) => {
    setActive(href);
    window.location.pathname = href;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, href: string) => {
    if (e.key === "Enter" || e.key === " ") {
      handleNav(href);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 flex flex-col items-center justify-between py-6 bg-white dark:bg-black shadow-lg border-r border-gray-100 dark:border-gray-900 z-50">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/robik_logo.png"
          alt="Logo Robik"
          width={40}
          height={40}
          priority
          className="mb-8"
        />
        <nav className="flex flex-col gap-6">
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <button
                    aria-label={item.label}
                    tabIndex={0}
                    onClick={() => handleNav(item.href)}
                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                    className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      active === item.href
                        ? "bg-primary/10 dark:bg-primary/20 text-primary"
                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                    }`}
                  >
                    <item.icon size={24} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>
      {/* Dark/Light mode toggle */}
      <button
        aria-label="Cambiar modo claro/oscuro"
        tabIndex={0}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary mb-2"
      >
        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
      </button>
    </aside>
  );
};

export default Sidebar;
