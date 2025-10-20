import localFont from 'next/font/local';

export const Poppins = localFont({
  src: [
    { path: '/fonts/regular.ttf', weight: '400', style: 'normal' },
    { path: '/fonts/bold.ttf', weight: '700', style: 'normal' },
  ],
});
