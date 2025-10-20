import { PageCenter } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const ProfileSkeleton = () => {
  return (
    <PageCenter>
      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded-2xl bg-background p-6">
          <div className="grid gap-8 md:grid-cols-[550px_1fr]">
            {/* LEFT: Photo + About */}
            <div className="space-y-6">
              {/* Photo */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-[104px] w-[104px] rounded-lg" />
                  <Skeleton className="h-10 w-44 rounded-md" />
                </div>
              </div>

              {/* About */}
              <div className="space-y-3">
                <Skeleton className="h-[360px] w-full rounded-md" />
              </div>
            </div>

            {/* RIGHT: Form fields */}
            <div className="grid gap-6">
              {/* Full Name */}
              <div className="grid gap-2">
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Position */}
              <div className="grid gap-2">
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Skeleton className="h-10 w-full" />
              </div>

              {/* LinkedIn */}
              <div className="grid gap-2">
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageCenter>
  );
};

export default ProfileSkeleton;
