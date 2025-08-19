import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentOrgId: string | null;
  profiles: Profile[];
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  switchOrg: (orgId: string) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfiles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      setProfiles(data || []);
      
      // Set current org if not set and user has profiles
      if (data?.length && !currentOrgId) {
        const savedOrgId = localStorage.getItem('currentOrgId');
        const orgToSet = savedOrgId && data.find(p => p.org_id === savedOrgId) 
          ? savedOrgId 
          : data[0].org_id;
        
        setCurrentOrgId(orgToSet);
        setProfile(data.find(p => p.org_id === orgToSet) || data[0]);
        localStorage.setItem('currentOrgId', orgToSet);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfiles(user.id);
    }
  };

  const switchOrg = (orgId: string) => {
    const newProfile = profiles.find(p => p.org_id === orgId);
    if (newProfile) {
      setCurrentOrgId(orgId);
      setProfile(newProfile);
      localStorage.setItem('currentOrgId', orgId);
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem('currentOrgId');
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid recursion
          setTimeout(() => {
            fetchUserProfiles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setProfiles([]);
          setCurrentOrgId(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfiles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    profile,
    currentOrgId,
    profiles,
    loading,
    signUp,
    signIn,
    signOut,
    switchOrg,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}