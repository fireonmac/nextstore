"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Sun, Moon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { useMounted } from "@/lib/hooks";

const ModeToggle = () => {
  const { theme, setTheme, themes } = useTheme();
  const isMounted = useMounted();

  if (!isMounted) {
    return null;
  }

  const icon =
    theme === "system" ? <SunMoon /> : theme === "dark" ? <Moon /> : <Sun />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{icon}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((t) => (
          <DropdownMenuCheckboxItem
            className="capitalize"
            key={t}
            checked={t === theme}
            onClick={() => setTheme(t)}
          >
            {t}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
