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
        const handleCallback = async () => {
            try {
                // Wait for Supabase to process the OAuth callback tokens from URL
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    throw new Error(sessionError?.message || 'No session found after Google login');
                }

                // Send Supabase access token to our backend → get JWT cookie
                const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ access_token: session.access_token }),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to authenticate with server');
                }

                await refetchUser();
                navigate('/');
            } catch (err: any) {
                console.error('Auth callback error:', err);
                setError(err.message || 'Something went wrong during Google sign-in');
            }
        };

        handleCallback();
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
                <p className="font-display font-semibold text-foreground text-lg">Signing you in with Google...</p>
                <p className="text-muted-foreground font-body text-sm">Just a moment</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
