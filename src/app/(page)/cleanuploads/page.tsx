'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

const CleanUploads = () => {
  const handler = async () => {
    await fetch('api/clean-uploads', { method: 'POST' });
  };
  return (
    <div>
      <Button onClick={handler}>Clean</Button>
    </div>
  );
};

export default CleanUploads;
