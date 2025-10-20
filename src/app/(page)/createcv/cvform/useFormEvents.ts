import { useState } from 'react';
import { ObjectId } from 'mongodb';
import { useCv } from '../useCv';
import { useLoader } from '@/app/context/LoaderContext';

export function useFormEvents(initialData: CvData & { _id?: string | ObjectId }) {
  const { saveCv } = useCv({ initialData });
  const [formState, setFormState] = useState<CvData>(initialData);
  const [cvId, setCvId] = useState<string>(initialData._id?.toString() ?? '');
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isSaveSuccess, setSaveSuccess] = useState<{ status: boolean; id: string; errorMessage?: string }>({
    status: false,
    id: '',
    errorMessage: '',
  });
  const { setLoading } = useLoader();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let imgUrl = formState.imgDataUrl;

      // only upload if user selected a new file
      if (imgFile) {
        const body = new FormData();
        body.append('file', imgFile);

        const res = await fetch('/api/blob-upload', { method: 'POST', body });
        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        imgUrl = data.url;
      }

      const payload = { ...formState, imgDataUrl: imgUrl };
      const { id } = await saveCv(payload);

      if (!cvId) setCvId(id);
      setSaveSuccess({ status: true, id });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setSaveSuccess({ status: false, id: '', errorMessage: err instanceof Error ? err.message : 'Unexpected error' });
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof CvData, value: any) => setFormState(prev => ({ ...prev, [field]: value }));

  return {
    formState,
    setFormState,
    cvId,
    setCvId,
    imgPreviewUrl,
    setImgPreviewUrl,
    imgFile,
    setImgFile,
    handleSubmit,
    handleChange,
    isSaveSuccess,
  };
}
