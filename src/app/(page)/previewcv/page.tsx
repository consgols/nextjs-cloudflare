'use client';

import React from 'react';
import { useCv } from '../createcv/useCv';
import ClientPdfViewer from '@/components/pdfgenerator/createpdfclient';
import Pdfdownlink from '@/components/pdfgenerator/pdfdownlink';
import { PageCenter } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PreviewCv = () => {
  const { cv, loading } = useCv();
  const router = useRouter();

  if (loading) {
    return (
      <PageCenter>
        <p className="p-6">Loading your PDF...</p>
      </PageCenter>
    );
  }

  const handleBackLink = () => {
    router.push('/createcv');
  };

  return (
    <PageCenter>
      <>
        <div className="mb-5 flex gap-5 items-center">
          <Button className="cursor-pointer" onClick={handleBackLink} variant="link">
            Back to CV Form
          </Button>
          <Pdfdownlink cvData={cv} />
        </div>
        <ClientPdfViewer cvData={cv} />
      </>
    </PageCenter>
  );
};

export default PreviewCv;
