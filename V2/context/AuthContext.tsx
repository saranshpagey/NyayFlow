import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    persona: 'advocate' | 'founder';
    setPersona: (persona: 'advocate' | 'founder') => void;
    guestId: string | null;
    queryCount: number;
    incrementQueryCount: () => void;
    resetGuestData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [persona, setPersonaState] = useState<'advocate' | 'founder'>('advocate');
    const [guestId, setGuestId] = useState<string | null>(null);
    const [queryCount, setQueryCount] = useState<number>(0);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // Load persona from localStorage
        const savedPersona = localStorage.getItem('nyayaflow_persona');
        if (savedPersona === 'founder' || savedPersona === 'advocate') {
            setPersonaState(savedPersona);
        }

        // Initialize Guest ID if not logged in
        if (!user) {
            let gid = localStorage.getItem('nyayaflow_guest_id');
            if (!gid) {
                gid = 'guest_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('nyayaflow_guest_id', gid);
            }
            setGuestId(gid);

            const count = parseInt(localStorage.getItem('nyayaflow_query_count') || '0');
            setQueryCount(count);
        } else {
            // User is logged in, clear guest data
            setGuestId(null);
            setQueryCount(0);
            // Clean up localStorage
            localStorage.removeItem('nyayaflow_guest_id');
            localStorage.removeItem('nyayaflow_query_count');
        }
    }, [user]);

    const setPersona = (p: 'advocate' | 'founder') => {
        setPersonaState(p);
        localStorage.setItem('nyayaflow_persona', p);
    };

    const incrementQueryCount = () => {
        const newCount = queryCount + 1;
        setQueryCount(newCount);
        localStorage.setItem('nyayaflow_query_count', newCount.toString());
    };

    const resetGuestData = () => {
        setQueryCount(0);
        // Regenerate a new guest ID immediately
        const newGid = 'guest_' + Math.random().toString(36).substr(2, 9);
        setGuestId(newGid);
        localStorage.setItem('nyayaflow_guest_id', newGid);
        localStorage.removeItem('nyayaflow_query_count');
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            session,
            user,
            loading,
            signOut,
            persona,
            setPersona,
            guestId,
            queryCount,
            incrementQueryCount,
            resetGuestData
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
