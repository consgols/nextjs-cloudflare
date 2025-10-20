'use client';

import React, { useEffect, useState } from 'react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const ThemeModeSwticher = () => {
  const { setTheme, theme } = useTheme();
  const [isChecked, setCheck] = useState(false);

  useEffect(() => {
    setCheck(theme === 'dark');
  }, [theme]);

  const handleChange = (val: boolean) => {
    if (val) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <>
      <Switch id="theme-mode" value={theme} checked={isChecked} onCheckedChange={handleChange} aria-readonly />
      <Label htmlFor="theme-mode">
        {theme === 'dark' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        )}
      </Label>
    </>
  );
};

export default ThemeModeSwticher;
