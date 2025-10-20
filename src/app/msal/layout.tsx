'use client';

import React, { ReactNode } from 'react';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
