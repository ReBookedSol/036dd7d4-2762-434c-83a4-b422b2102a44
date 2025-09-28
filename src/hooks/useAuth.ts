import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'premium' | 'free';
  grade: string | null;
  school: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Simple in-memory cache to avoid duplicate profile fetches across components
let cachedProfile: Profile | null = null;
let cachedUserId: string | null = null;
let pendingProfilePromise: Promise<Profile | null> | null = null;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer Supabase calls and prevent deadlocks
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Use cached profile to reduce duplicate network calls across components
      if (cachedUserId === userId && cachedProfile) {
        setProfile(cachedProfile);
        setLoading(false);
        return;
      }
      if (pendingProfilePromise && cachedUserId === userId) {
        const data = await pendingProfilePromise;
        if (data) setProfile(data);
        return;
      }

      cachedUserId = userId;
      setLoading(true);
      pendingProfilePromise = (async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }
        cachedProfile = data;
        return data;
      })();

      const data = await pendingProfilePromise;
      pendingProfilePromise = null;
      setLoading(false);
      if (data) setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === "admin";
  const isPremium = profile?.role === "premium" || profile?.role === "admin";

  return {
    user,
    profile,
    session,
    loading,
    isAdmin,
    isPremium,
    fetchProfile,
  };
};