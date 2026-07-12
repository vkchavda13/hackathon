import type { Metadata } from 'next';
import Providers from '@/providers/Providers';
import React from 'react';

export const metadata: Metadata = {
  title: 'AssetFlow — Enterprise Asset Management',
  description: 'ERP-grade Asset Management System for Odoo Hackathon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
