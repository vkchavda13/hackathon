import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  role: 'admin' | 'manager' | 'head' | 'employee';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/forgot-password');

  // Check active session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            // Ensure local storage user-role matches current session
            localStorage.setItem('user-role', data.user.role);
            window.dispatchEvent(new Event('user-role-changed'));
          } else {
            setUser(null);
            if (!isAuthPage) {
              router.push('/login');
            }
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [pathname, isAuthPage, router]);

  // Handle path guard redirection
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [loading, user, isAuthPage, router]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();
    setUser(data.user);
    localStorage.setItem('user-role', data.user.role);
    window.dispatchEvent(new Event('user-role-changed'));
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user-role');
      window.dispatchEvent(new Event('user-role-changed'));
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
