import React from 'react';
import { ToggleTheme } from '@/components/ToggleTheme';
import Logo from '@/components/logo';

type PropsType = {
  children: React.ReactNode;
};

const Header = ({ children }: Readonly<PropsType>) => {
  return (
    <div className="min-h-screen w-full py-10">
      <div className="mb-10 flex items-center justify-between">
        <Logo />
        <ToggleTheme />
      </div>
      {children}
    </div>
  );
};

export default Header;
