'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { Shield, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import React from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password recovery instructions sent to your email.');
      router.push('/login');
    }, 450);
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
            Recovery Account
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.5 }}>
            Retrieve your password access keys
          </Typography>
        </Box>

        <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
          <CardContent sx={{ p: '32px !important' }}>
            <Box component="form" onSubmit={handleResetSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontSize: '0.75rem' }}>
                Enter your administrative company email. We will send you instructions to reset your password security keys.
              </Typography>
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                sx={{ height: 38 }}
              >
                {isLoading ? 'Processing Recovery…' : 'Send Recovery Keys'}
              </Button>

              <Button
                component={Link}
                href="/login"
                variant="outlined"
                fullWidth
                sx={{ height: 38, borderColor: '#cbd5e1', color: '#475569', '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' } }}
              >
                Return to Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
