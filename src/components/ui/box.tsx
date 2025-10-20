import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type PropsType = { children: ReactNode; className?: string | undefined };

export const PageCenter: React.FunctionComponent<PropsType> = props => {
  return (
    <div className={cn('flex justify-center items-center', props?.className)}>
      <div className="w-250 ">{props.children}</div>
    </div>
  );
};
