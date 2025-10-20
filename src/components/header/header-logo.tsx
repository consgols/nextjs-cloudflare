'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const HeaderLogo = () => {
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState('/assets/images/avensia-horizontal-light.png');

  useEffect(() => {
    setLogoUrl(
      theme === 'dark' ? '/assets/images/avensia-horizontal-light.png' : '/assets/images/avensia-horizontal-dark.png',
    );
  }, [theme]);

  return (
    <Link href="#">
      <Image src={logoUrl} width={200} height={55} alt="Avensia Logo" />
    </Link>
  );
};

export default HeaderLogo;
