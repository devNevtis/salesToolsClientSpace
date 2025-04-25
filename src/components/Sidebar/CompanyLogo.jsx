//src/components/Sidebar/CompanyLogo.jsx
'use client';
import { Card } from '@/components/ui/card';
import useCompanyTheme from '@/store/useCompanyTheme';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const CompanyLogo = () => {
  const { theme } = useCompanyTheme();

  return (
    <Card className="w-full bg-white shadow-md">
      <div className="flex justify-center items-center p-2 h-[80px]">
        {theme.logo ? (
          <div className="relative w-full h-full">
            <Image
              src={theme.logo}
              alt="Company Logo"
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ) : (
          <Skeleton className="w-full h-full rounded-lg" />
        )}
      </div>
    </Card>
  );
};

export default CompanyLogo;
