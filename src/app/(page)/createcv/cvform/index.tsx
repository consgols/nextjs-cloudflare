'use client';

import React, { useEffect, useRef } from 'react';
import { CvWithId } from '../useCv';
import { Button } from '@/components/ui/button';
import CVForm from './components/cvform';
import { useFormEvents } from './useFormEvents';
import { LogoutAlert } from './components/logout';
import { SaveAlert, SaveAlertHandle } from './components/savealert';
import { useIsUpdated } from './useIsUpdated';
import { useUnsavedChangesPrompt } from './useUnsavedChangesPrompt';
import { UnsavedChangesModal } from './components/unsavedchangesmodal';
import { H1 } from '@/components/ui/typography';
import { FileText, Save } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useLoader } from '@/app/context/LoaderContext';

export default function CVFormPage({ initialForm }: { initialForm: CvWithId }) {
  const saveAlertRef = useRef<SaveAlertHandle>(null);
  const { loading } = useLoader();
  const {
    cvId,
    setCvId,
    formState,
    setFormState,
    imgPreviewUrl,
    setImgPreviewUrl,
    setImgFile,
    handleChange,
    handleSubmit,
    isSaveSuccess,
  } = useFormEvents(initialForm);

  const { isUpdated, initialSnapshot } = useIsUpdated<CvData>(formState, initialForm);

  const handleGeneratePDF = () => {
    attemptNavigate('/previewcv');
  };

  const handleDiscard = () => {
    setFormState(initialSnapshot);
  };

  useEffect(() => {
    if (isSaveSuccess.status) {
      saveAlertRef.current?.open();
    }
  }, [isSaveSuccess]);

  const { open, attemptNavigate, confirmDiscard, cancelStay, confirmSave } = useUnsavedChangesPrompt(isUpdated, {
    onSave: handleSubmit,
    onDiscard: handleDiscard,
  });

  return (
    <div>
      <div className="w-full">
        <H1 className="font-bold w-full flext text-center mb-6 lg:text-3xl">Avensia CV Form</H1>
        <UnsavedChangesModal
          confirmSave={confirmSave}
          confirmDiscard={confirmDiscard}
          cancelStay={cancelStay}
          isOpen={open}
        />
        <SaveAlert isSaveSuccess={isSaveSuccess} ref={saveAlertRef} />
        <div className="flex justify-start w-full gap-5">
          <Button onClick={handleSubmit} type="submit" className="w-1/6  px-4 py-3  shadow-sm">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Save /> Save CV
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={handleGeneratePDF} className="w-50" disabled={!initialForm?._id}>
            <FileText /> Generate CV as PDF
          </Button>
          <LogoutAlert />
        </div>
      </div>
      <div className="p-5 shadow-xl/30 inset-shadow-xs">
        <CVForm
          formState={formState}
          cvId={cvId}
          setCvId={setCvId}
          initialData={initialForm}
          imgPreviewUrl={imgPreviewUrl}
          setImgFile={setImgFile}
          setImgPreviewUrl={setImgPreviewUrl}
          setFormState={setFormState}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
