"use client";

import { useGamification } from "@/contexts/gamification-context";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/src/i18n/routing";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hardcoded for dev
const SUPABASE_URL = "https://elemiywbemevklssilhz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZW1peXdiZW1ldmtsc3NpbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk0NjIsImV4cCI6MjA3OTcyNTQ2Mn0.OYNcFKygWDgQ0ywg_lm7bCaLwNv_Nq5Yuppn0koMv_s";

export function GamificationHeader() {
  const { level, xp, progress, user } = useGamification();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient({
      supabaseUrl: SUPABASE_URL,
      supabaseKey: SUPABASE_KEY
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh(); // Force refresh to update middleware state
  };

  if (!mounted) {
      return <div className="h-10 w-32 bg-muted/20 rounded-lg animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-3 bg-background/50 backdrop-blur px-3 py-1.5 rounded-full border shadow-sm">
      <div className="flex items-center gap-1.5">
        <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-1 rounded-full">
             <Trophy className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm">Lvl {level}</span>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      <div className="flex flex-col w-24 gap-1 mr-2">
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground leading-none">
            <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> {xp} XP</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {!user ? (
          <Link href="/login">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full">
                <UserCircle className="w-5 h-5" />
            </Button>
          </Link>
      ) : (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold hover:bg-primary/90">
                    {user.email?.[0].toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
