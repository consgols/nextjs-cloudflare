'use client';

import React from 'react';
import CVFormPage from './cvform';
import { useCv } from './useCv';
import { PageCenter } from '@/components/ui/box';
import ProfileSkeleton from './cvform/components/ProfileSkeleton';

const CreateCvClient = () => {
  const { cv, loading } = useCv();

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <PageCenter>
      <>
        <CVFormPage initialForm={cv} />
      </>
    </PageCenter>
  );
};

export default CreateCvClient;
