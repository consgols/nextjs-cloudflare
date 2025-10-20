'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const logo =
    mounted && resolvedTheme === 'dark'
      ? '/assets/images/avensia-horizontal-light.png'
      : '/assets/images/avensia-horizontal-dark.png';
  return <Image className="object-cover w-50" alt="Avensia Logo" src={logo} width={350} height={97} />;
};

export default Logo;
