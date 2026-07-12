// ─── MUI Theme ────────────────────────────────────────────────────────────────
// Replicates the AM Guni admin panel's visual language using MUI's design tokens.
// Same colors, spacing, typography, borders, and shadows.

'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#714B67', // Odoo Purple
      light: '#8c6081',
      dark: '#54384d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00A09D', // Odoo Teal
      light: '#33b3b0',
      dark: '#007875',
    },
    error: {
      main: '#dc2626',
      light: '#fecaca',
      dark: '#b91c1c',
    },
    warning: {
      main: '#d97706',
      light: '#fef3c7',
      dark: '#b45309',
    },
    success: {
      main: '#16a34a',
      light: '#dcfce7',
      dark: '#15803d',
    },
    info: {
      main: '#714B67',
      light: '#eae6f0',
      dark: '#54384d',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(113, 75, 103, 0.08)',
    },
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    h1: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3, color: '#1e293b' },
    h2: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, color: '#1e293b' },
    h3: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5, color: '#1e293b' },
    h4: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5, color: '#1e293b' },
    h5: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.5, color: '#1e293b' },
    h6: { fontSize: '0.625rem', fontWeight: 700, lineHeight: 1.5, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
    body1: { fontSize: '0.8125rem', lineHeight: 1.5, color: '#1e293b' },
    body2: { fontSize: '0.75rem', lineHeight: 1.5, color: '#64748b' },
    caption: { fontSize: '0.625rem', lineHeight: 1.5, color: '#94a3b8' },
    button: { fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' },
    subtitle1: { fontSize: '0.8125rem', fontWeight: 500, color: '#475569' },
    subtitle2: { fontSize: '0.75rem', fontWeight: 500, color: '#64748b' },
    overline: { fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' },
  },

  shape: {
    borderRadius: 6,
  },

  spacing: 8,

  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    // Fill remaining shadow slots with the same subtle shadow
    ...Array(19).fill('0 1px 3px 0 rgba(0, 0, 0, 0.1)'),
  ] as unknown as typeof createTheme extends (o: infer O) => unknown ? O extends { shadows: infer S } ? S : never : never,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          scrollbarGutter: 'stable',
        },
        '*': {
          boxSizing: 'border-box',
        },
        // Compact scrollbars
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: '#94a3b8',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          padding: '6px 12px',
          minHeight: 32,
        },
        containedPrimary: {
          '&:hover': { backgroundColor: '#54384d' },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#475569',
          '&:hover': {
            borderColor: '#cbd5e1',
            backgroundColor: '#f8fafc',
          },
        },
      },
    },

    MuiIconButton: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: 6,
          color: '#94a3b8',
          '&:hover': {
            backgroundColor: '#f1f5f9',
            color: '#475569',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: '0.8125rem',
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: 1,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        },
      },
    },

    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          borderRadius: 6,
        },
      },
    },

    MuiChip: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          fontSize: '0.625rem',
          fontWeight: 500,
          height: 22,
          borderRadius: 11,
        },
        label: {
          padding: '0 8px',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 20px',
          borderTop: '1px solid #f1f5f9',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '0.625rem',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '8px 12px',
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            borderBottom: '1px solid #f8fafc',
            transition: 'background-color 150ms ease',
            '&:hover': {
              backgroundColor: 'rgba(248, 250, 252, 0.6)',
            },
          },
          '& .MuiTableCell-body': {
            fontSize: '0.75rem',
            padding: '8px 12px',
            borderBottom: '1px solid #f8fafc',
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        outlined: {
          borderColor: '#e2e8f0',
          borderRadius: 6,
        },
      },
    },

    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
          borderRadius: 6,
          boxShadow: 'none',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 500,
          textTransform: 'none',
          minHeight: 40,
          padding: '8px 16px',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
        },
      },
    },

    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          fontSize: '0.6875rem',
          backgroundColor: '#1e293b',
          borderRadius: 4,
          padding: '4px 8px',
        },
        arrow: {
          color: '#1e293b',
        },
      },
    },

    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
        separator: {
          fontSize: '0.75rem',
          color: '#cbd5e1',
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 22,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(18px)',
            '& + .MuiSwitch-track': {
              backgroundColor: '#2563eb',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 18,
          height: 18,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        },
        track: {
          borderRadius: 11,
          backgroundColor: '#cbd5e1',
          opacity: 1,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
