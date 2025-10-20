import React, { FunctionComponent, useRef, useState } from 'react';
import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, PercentCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import setCanvasPreview from './setCanvasPreview';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

type PropsType = {
  updateAvatar: (img: string | Blob, filename?: string) => void;
};

const ImageCropper: FunctionComponent<PropsType> = props => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<PercentCrop>();
  const [error, setError] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { updateAvatar } = props;

  const onSelectFile = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const imageElement = new Image();
      const imgUrl = reader.result?.toString() || '';
      imageElement.src = imgUrl;

      imageElement.addEventListener('load', evload => {
        const img = evload.currentTarget as HTMLImageElement | null;
        if (!img) return;

        const { naturalWidth, naturalHeight } = img;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError('Image must be at least 150 x 150 pixels');
          return setImgSrc('');
        }
      });

      setImgSrc(imgUrl);
    });

    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height,
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const cropImageHandler = async () => {
    if (!crop || !imgRef.current?.width || !imgRef.current?.height) return;

    setCanvasPreview(
      imgRef.current!,
      previewCanvasRef.current!,
      convertToPixelCrop(crop, imgRef.current!.width, imgRef.current!.height),
    );

    const canvas = previewCanvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';

    // quick downscale if huge
    const MAX = 1024;
    let workCanvas = canvas;
    if (canvas.width > MAX || canvas.height > MAX) {
      const s = Math.min(MAX / canvas.width, MAX / canvas.height);
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width * s;
      tmp.height = canvas.height * s;
      tmp.getContext('2d')!.drawImage(canvas, 0, 0, tmp.width, tmp.height);
      workCanvas = tmp;
    }

    // single quick encode (0.8 quality WebP)
    const blob = await new Promise<Blob>((res, rej) =>
      workCanvas.toBlob(b => (b ? res(b) : rej('toBlob fail')), 'image/webp', 0.8),
    );

    const file = new File([blob], 'avatar.webp', { type: 'image/webp' });
    updateAvatar(file);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Update Photo</DialogTitle>
        <Label className="block mb-3 w-fit">
          <span className="sr-only">Choose File</span>
          <Input
            type="file"
            accept="image/*"
            onChange={e => onSelectFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs"
          />
        </Label>
      </DialogHeader>
      {error && <p className="text-red-400 tex-xs">{error}</p>}
      {imgSrc && (
        <>
          <div className="flex flex-col items-center ">
            <ReactCrop
              crop={crop}
              circularCrop
              keepSelection
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
              className="max-h-100"
            >
              <img ref={imgRef} src={imgSrc} alt="upload" onLoad={onImageLoad} />
            </ReactCrop>
            <DialogClose asChild>
              <Button className="mt-5" onClick={cropImageHandler}>
                Crop Image
              </Button>
            </DialogClose>
          </div>
          {crop && (
            <canvas
              ref={previewCanvasRef}
              className="mt-4"
              style={{
                display: 'none',
                border: '1px solid black',
                objectFit: 'contain',
                width: 200,
                height: 200,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ImageCropper;
