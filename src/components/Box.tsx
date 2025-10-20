import { cn } from '@/lib/utils';
import React from 'react';

type PropsType = {
  children: React.ReactNode;
  customHeading?: React.ReactNode;
  className?: string;
};
const Box = ({ children, customHeading, className }: PropsType) => {
  return (
    <div className={cn('box-content dark:bg-neutral-800 shadow-xl/20 rounded-md inset-shadow-2xs', className)}>
      {customHeading && customHeading}
      <div>{children}</div>
    </div>
  );
};

export default Box;
