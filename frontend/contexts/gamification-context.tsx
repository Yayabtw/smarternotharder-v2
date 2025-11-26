"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const STORAGE_KEY = 'smarter-gamification';

// Temporary hardcoded values for dev environment
const SUPABASE_URL = "https://elemiywbemevklssilhz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZW1peXdiZW1ldmtsc3NpbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk0NjIsImV4cCI6MjA3OTcyNTQ2Mn0.OYNcFKygWDgQ0ywg_lm7bCaLwNv_Nq5Yuppn0koMv_s";

interface GamificationContextType {
  xp: number;
  level: number;
  badges: string[];
  addXp: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  progress: number;
  user: any | null;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY
  });
  
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Load User
  useEffect(() => {
      const getUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
      };
      getUser();
  }, [supabase]);

  // Load Data (DB or Local)
  useEffect(() => {
    const loadData = async () => {
        if (user) {
            // Load from DB
            const { data, error } = await supabase
                .from('profiles')
                .select('xp, level')
                .eq('id', user.id)
                .single();
            
            if (data) {
                setXp(data.xp || 0);
                setLevel(data.level || 1);
                // badges not in DB yet
            }
        } else {
            // Load from LocalStorage
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    setXp(data.xp || 0);
                    setLevel(data.level || 1);
                    setBadges(data.badges || []);
                } catch (e) {
                    console.error("Failed to parse gamification data", e);
                }
            }
        }
        setLoaded(true);
    };
    
    if (!loaded) { // Only load once logic or when user changes
        loadData();
    }
  }, [user, supabase, loaded]);

  // Save Data
  useEffect(() => {
    if (!loaded) return;
    
    // Always save to local as backup/cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp, level, badges }));

    // Sync to DB if user exists
    if (user) {
        const syncToDb = async () => {
            await supabase.from('profiles').upsert({
                id: user.id,
                xp,
                level,
                updated_at: new Date().toISOString()
            });
        };
        // Debounce this in real app
        syncToDb();
    }
  }, [xp, level, badges, loaded, user, supabase]);

  const addXp = (amount: number) => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      } else {
          setLevel(newLevel); // Ensure consistent
      }
      return newXp;
    });
  };

  const unlockBadge = (badgeId: string) => {
      if (!badges.includes(badgeId)) {
          setBadges(prev => [...prev, badgeId]);
      }
  };

  const progress = xp % 100;

  return (
    <GamificationContext.Provider value={{ xp, level, badges, addXp, unlockBadge, progress, user }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
