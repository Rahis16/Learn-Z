'use client';

import { ShieldAlert, ArrowLeftCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ForbiddenPage = () => {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-md max-w-md w-full border border-[var(--gray-200)]">
        <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Oops! Access Denied</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          You don’t have permission to access this page. <br />
          Please contact the administrator if you think this is a mistake.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeftCircle size={18} />
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/contact')}
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            Contact Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
