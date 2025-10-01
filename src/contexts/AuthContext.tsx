import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile } from '../utils/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  username: string;
  type: 'player' | 'creator';
  walletAddress?: string;
  avatar?: string;
  earnings?: number;
  gamesCreated?: number;
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, type: 'player' | 'creator') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        setUser({
          id: profile.id,
          email: supabaseUser.email || '',
          username: profile.username,
          type: profile.user_type,
          walletAddress: profile.wallet_address,
          avatar: profile.avatar_url,
          earnings: profile.total_earnings,
          gamesCreated: profile.games_created,
          profile,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    type: 'player' | 'creator'
  ): Promise<boolean> => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            user_type: type,
            total_earnings: 0,
            games_created: 0,
            games_played: 0,
          });

        if (profileError) throw profileError;

        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const profileUpdates: any = {};
      if (updates.username) profileUpdates.username = updates.username;
      if (updates.walletAddress !== undefined) profileUpdates.wallet_address = updates.walletAddress;
      if (updates.avatar !== undefined) profileUpdates.avatar_url = updates.avatar;

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};