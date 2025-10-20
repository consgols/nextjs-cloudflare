import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageCropper from './imagecropper';
import { dataURLtoFile } from '@/app/lib/utils/upload';
import { Upload } from 'lucide-react';

type PropsType = {
  form: CvData;
  onUploadImage: (file: File | null) => void;
};

const ProfilePicture: React.FunctionComponent<PropsType> = props => {
  const { form, onUploadImage } = props;
  const [avatarUrl, setAvatarUrl] = useState<string>();

  const updateAvatar = (img: string | Blob, filename?: string) => {
    if (typeof img === 'string') {
      // only used if some other component still sends base64
      setAvatarUrl(img);
      onUploadImage(dataURLtoFile(img) ?? null);
      return;
    }

    // blob/file path (new)
    const file =
      img instanceof File ? img : new File([img], filename ?? 'avatar.webp', { type: img.type || 'image/webp' });
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    onUploadImage(file);
  };

  return (
    <Dialog>
      <div className="space-y-3 mb-5">
        <Label htmlFor="profile">Photo</Label>
        <div className="flex items-start gap-4">
          {form.imgDataUrl ? (
            <Avatar className="h-24 w-24 rounded-xl border bg-gray-300">
              <AvatarImage src={avatarUrl ?? form.imgDataUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24 rounded-xl border bg-gray-300">
              <AvatarImage src={avatarUrl ?? '/assets/images/avensia-logo-light.jpg'} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <DialogTrigger asChild>
            <Button>
              <Upload /> Update Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-900 h-150">
            <ImageCropper updateAvatar={updateAvatar} />
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
};

export default ProfilePicture;
