
'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        searchQuery,
        setSearchQuery,
      } as any);
    }
    return child;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-1">{childrenWithProps}</main>
    </div>
  );
}
