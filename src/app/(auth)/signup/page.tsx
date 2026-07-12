'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, IconButton, MenuItem, Link as MuiLink } from '@mui/material';
import { Shield, Mail, Lock, User, Phone, Briefcase, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import React from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designation, setDesignation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load departments list for signup selection
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartments(data.filter((d: any) => d.isActive));
        }
      })
      .catch((err) => console.error('Failed to load departments', err));
  }, []);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !password || !departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          departmentId,
          designation: designation || 'Software Engineer',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
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
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Header Logo section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              backgroundColor: '#0b1120',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              mb: 1.5,
            }}
          >
            <Shield size={26} color="#ffffff" />
          </Box>
          <Typography variant="h1" sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b1120' }}>
            Create Employee Account
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.72rem', mt: 0.5 }}>
            Register to join the AssetFlow Enterprise network
          </Typography>
        </Box>

        {/* Signup form Card */}
        <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5 }}>
          <CardContent sx={{ p: '28px !important' }}>
            <Box component="form" onSubmit={handleSignupSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={15} color="#94a3b8" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Box>

              <TextField
                type="email"
                label="Email Address"
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={15} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Phone Number"
                placeholder="+91-98765-43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={15} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                select
                label="Department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Briefcase size={15} color="#94a3b8" sx={{ mr: 1 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id} sx={{ fontSize: '0.8rem' }}>
                    {dept.name} ({dept.code})
                  </MenuItem>
                ))}
                {departments.length === 0 && (
                  <MenuItem disabled sx={{ fontSize: '0.8rem' }}>
                    No departments available
                  </MenuItem>
                )}
              </TextField>

              <TextField
                label="Designation / Job Role"
                placeholder="Software Engineer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                fullWidth
                size="small"
              />

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
                        <Lock size={15} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </IconButton>
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
                sx={{ height: 38, mt: 1 }}
              >
                {isLoading ? 'Creating Account…' : 'Register Account'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Informational footer link */}
        <Box sx={{ mt: 2.5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
            Already have an employee account?{' '}
            <MuiLink
              component={Link}
              href="/login"
              sx={{ fontWeight: 650, color: '#714B67', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
