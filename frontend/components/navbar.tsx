"use client";

import { Link } from "@/src/i18n/routing";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Sparkles, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/login");
  const [session, setSession] = useState<any>(null);
  
  // Hardcoded for dev
  const SUPABASE_URL = "https://elemiywbemevklssilhz.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZW1peXdiZW1ldmtsc3NpbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk0NjIsImV4cCI6MjA3OTcyNTQ2Mn0.OYNcFKygWDgQ0ywg_lm7bCaLwNv_Nq5Yuppn0koMv_s";

  const supabase = createClientComponentClient({
      supabaseUrl: SUPABASE_URL,
      supabaseKey: SUPABASE_KEY
  });

  useEffect(() => {
      const getSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
      };
      getSession();
  }, [supabase]);

  return (
    <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>SmarterNotHarder</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Product
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {session ? (
                <Link href="/dashboard">
                    <Button size="sm" className="gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Button>
                </Link>
            ) : !isLoginPage && (
                 <div className="flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link href="/login">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
