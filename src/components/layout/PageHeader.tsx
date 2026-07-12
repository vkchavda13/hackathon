'use client';

import { Box, Typography, Button, Breadcrumbs, Link as MuiLink, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
  onMenuToggle?: () => void;
}

export default function PageHeader({
  title,
  icon,
  breadcrumbs = [],
  actionLabel,
  actionHref,
  onActionClick,
  actionIcon,
  onMenuToggle,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        px: 3,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Left section: breadcrumbs, title, icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        {onMenuToggle && (
          <IconButton
            onClick={onMenuToggle}
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 0.5, p: 0.5 }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNextIcon sx={{ fontSize: 10, color: '#cbd5e1' }} />}
              sx={{ mb: 0.25 }}
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={index} variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem', fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                ) : (
                  <MuiLink
                    key={index}
                    component={Link}
                    href={item.href || '#'}
                    sx={{
                      color: '#64748b',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { color: '#2563eb' },
                    }}
                  >
                    {item.label}
                  </MuiLink>
                );
              })}
            </Breadcrumbs>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && <Box sx={{ display: 'flex', color: '#94a3b8' }}>{icon}</Box>}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right section: CTA action */}
      {actionLabel && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actionHref ? (
            <Button
              component={Link}
              href={actionHref}
              variant="contained"
              color="primary"
              startIcon={actionIcon}
              sx={{ height: 32 }}
            >
              {actionLabel}
            </Button>
          ) : (
            <Button
              onClick={onActionClick}
              variant="contained"
              color="primary"
              startIcon={actionIcon}
              sx={{ height: 32 }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
