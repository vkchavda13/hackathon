'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, IconButton, Link as MuiLink } from '@mui/material';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      // Save token, role, and profile details to localStorage
      localStorage.setItem('user-token', data.token);
      localStorage.setItem('user-role', data.user.role);
      localStorage.setItem('user-info', JSON.stringify(data.user));
      // Set 24 hours expiry time
      localStorage.setItem('user-token-expiry', String(Date.now() + 24 * 60 * 60 * 1000));

      // Trigger event to notify layout components
      window.dispatchEvent(new Event('user-role-changed'));

      toast.success('Logged in successfully!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* Header Logo section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: '#0b1120',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              mb: 2,
            }}
          >
            <Shield size={28} color="#ffffff" />
          </Box>
          <Typography variant="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b1120' }}>
            AssetFlow
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.5 }}>
            Enterprise Asset Management System
          </Typography>
        </Box>

        {/* Login form Card */}
        <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
          <CardContent sx={{ p: '32px !important' }}>
            <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                type="email"
                label="Email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={16} color="#94a3b8" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <MuiLink
                    component={Link}
                    href="/forgot-password"
                    sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                sx={{ height: 38 }}
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Signup informational card */}
        <Card sx={{ mt: 3, border: '1px dashed #cbd5e1', borderRadius: 1.5, backgroundColor: 'rgba(241, 245, 249, 0.5)' }}>
          <CardContent sx={{ p: '20px !important', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 650, mb: 2 }}>
              New here? Create an account to register as a member of your company's organization.
            </Typography>
            <Button
              component={Link}
              href="/signup"
              variant="outlined"
              fullWidth
              sx={{ height: 34, borderColor: '#cbd5e1', color: '#475569', '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' } }}
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
