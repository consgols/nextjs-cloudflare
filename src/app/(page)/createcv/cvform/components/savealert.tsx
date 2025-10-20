import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export type SaveAlertHandle = {
  open: () => void;
  close: () => void;
};

type SaveAlertProps = {
  isSaveSuccess: { status: boolean; id: string; errorMessage?: string };
};

export const SaveAlert = forwardRef<SaveAlertHandle, SaveAlertProps>((_props, ref) => {
  const { isSaveSuccess } = _props;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const handleGeneratePDF = () => {
    router.push('/previewcv', undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alert</DialogTitle>
          <DialogDescription>
            {isSaveSuccess.status ? 'CV Successfully Saved' : `${isSaveSuccess?.errorMessage}`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button variant="secondary" onClick={handleGeneratePDF} className="w-50">
            Generate CV as PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
SaveAlert.displayName = 'SaveAlert';
