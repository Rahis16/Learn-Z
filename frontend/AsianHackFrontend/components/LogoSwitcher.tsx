'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const Logo = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    if (htmlTheme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    // Optional: Listen for theme changes
    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
      setTheme(updatedTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-32 h-auto">
      <Image
        src={theme === 'light' ? '/images/logo-light.png' : '/images/logo-dark.png'}
        alt="Site Logo"
        priority
        height={500} width={500} className="w-[75px] md:w-[110px]"
      />
    </div>
  );
};

export default Logo;
