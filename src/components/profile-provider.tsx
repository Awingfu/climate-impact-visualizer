"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ClimateProfile } from "@/climate/types";
import { defaultProfile } from "@/climate";
import { loadProfile, saveProfile, clearProfile } from "@/lib/storage";

type ProfileContextValue = {
  profile: ClimateProfile;
  updateCategory: <K extends keyof ClimateProfile>(category: K, value: Partial<ClimateProfile[K]>) => void;
  resetProfile: () => void;
  hydrated: boolean;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ClimateProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  // Runs once on mount, client-side only, so this never touches SSR HTML output.
  // localStorage can't be read during the initial render (server has no window),
  // so profile state is deliberately synced from it here rather than in an initializer.
  useEffect(() => {
    const stored = loadProfile();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from an external store (localStorage) on mount
      setProfile((prev) => ({
        transportation: { ...prev.transportation, ...stored.transportation },
        flights: { ...prev.flights, ...stored.flights },
        home: { ...prev.home, ...stored.home },
        food: { ...prev.food, ...stored.food },
        shopping: { ...prev.shopping, ...stored.shopping },
      }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProfile(profile);
  }, [profile, hydrated]);

  function updateCategory<K extends keyof ClimateProfile>(category: K, value: Partial<ClimateProfile[K]>) {
    setProfile((prev) => ({
      ...prev,
      [category]: { ...prev[category], ...value },
    }));
  }

  function resetProfile() {
    clearProfile();
    setProfile(defaultProfile);
  }

  return (
    <ProfileContext.Provider value={{ profile, updateCategory, resetProfile, hydrated }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
