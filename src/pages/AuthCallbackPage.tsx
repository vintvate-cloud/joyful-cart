import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { refetchUser } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        let isSynced = false;

        const syncSession = async (session: any) => {
            if (isSynced || !session) return;
            isSynced = true;

            try {
                const pendingPassword = sessionStorage.getItem('pending_password');

                // Send Supabase access token to our backend → get JWT cookie
                const res = await fetch('/api/auth/supabase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        access_token: session.access_token,
                        password: pendingPassword
                    }),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to authenticate with server');
                }

                if (pendingPassword) {
                    sessionStorage.removeItem('pending_password');
                }

                await refetchUser();
                navigate('/');
            } catch (err: any) {
                console.error('Auth callback sync error:', err);
                setError(err.message || 'Something went wrong during sign-in');
            }
        };

        // 1. Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) syncSession(session);
        });

        // 2. Listen for auth changes (useful for email verification redirects)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                // Small delay to ensure session is fully settled
                setTimeout(() => syncSession(session), 500);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, refetchUser]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4 max-w-md px-6">
                    <div className="text-5xl">😔</div>
                    <h1 className="text-2xl font-display font-black text-foreground">Sign-in Failed</h1>
                    <p className="text-muted-foreground font-body">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="font-display font-semibold text-foreground text-lg">Finishing sign-in...</p>
                <p className="text-muted-foreground font-body text-sm">Welcome to JoyLand!</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
