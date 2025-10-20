import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';

type PropsType = {
  isOpen: boolean;
  confirmDiscard: () => Promise<void>;
  cancelStay: () => void;
  confirmSave: () => Promise<void>;
};

export function UnsavedChangesModal({ isOpen, confirmDiscard, cancelStay, confirmSave }: PropsType) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>You have unsaved changes. Save before leaving?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelStay}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDiscard}>Discard</AlertDialogAction>
          <AlertDialogAction onClick={confirmSave}>Save CV</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
