'use client';

import React, { useEffect } from 'react';
import CVFormPage from './cvform';
import { useCv } from './useCv';
import { PageCenter } from '@/components/ui/box';
import ProfileSkeleton from './cvform/components/ProfileSkeleton';

const CreateCvClient = () => {
  const { cv, refresh, loading } = useCv();

  useEffect(() => {
    const fetchMyCv = async () => {
      refresh();
    };

    fetchMyCv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
