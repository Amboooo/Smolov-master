"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";


export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Fallback for SSR/pre-mount to avoid hydration mismatch.
    // Renders an icon consistent with the default 'light' resolvedTheme.
    return <Button variant="ghost" size="icon" className="w-9 h-9" disabled><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>; 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          {resolvedTheme === 'dark' ? 
            <Moon className="h-[1.2rem] w-[1.2rem]" /> : 
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          }
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} disabled={theme === 'light'}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} disabled={theme === 'dark'}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} disabled={theme === 'system'}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
