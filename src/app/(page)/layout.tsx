import React from 'react';
import { PageCenter } from '@/components/ui/box';
import Header from './header';

type PropsType = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: Readonly<PropsType>) => {
  return (
    <PageCenter>
      <Header>{children}</Header>
    </PageCenter>
  );
};

export default PageLayout;
