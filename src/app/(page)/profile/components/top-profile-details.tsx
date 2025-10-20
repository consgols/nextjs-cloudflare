import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { H2, H4 } from '@/components/ui/typography';
import Image from 'next/image';

const TopProfileDetails = () => {
  return (
    <>
      <div className="z-1 relative shadow-xl">
        <AspectRatio ratio={144 / 25}>
          <Image
            src={'/assets/images/avensia-cover-new.jpeg'}
            width={1152}
            height={200}
            alt="Avensia Cover"
            className="w-full h-full rounded-t-lg object-cover"
          />
        </AspectRatio>
      </div>
      <div className="flex item-center gap-6 pl-6 mt-[-100] z-10 relative ">
        <div>
          <Avatar className="size-40 border-white dark:border-[var(--primary)] border-5">
            <AvatarImage src="/assets/images/sample-pf.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="ml-50 pb-5 mt-[-50] text-gray-500 dark:text-white">
        <H2 className="pb-0">Consorcio Golosino Jr.</H2>
        <H4 className=" dark:text-[var(--primary)]">Sr. Frontend Developer at Avensia Philippines, Inc.</H4>
        <div className="flex items-center gap-2 mt-3">
          <Badge>Office: Cebu</Badge>
          <Badge>EComm</Badge>
          <Badge variant={'secondary'} className="bg-green-500">
            Available
          </Badge>
        </div>
      </div>
    </>
  );
};

export default TopProfileDetails;
