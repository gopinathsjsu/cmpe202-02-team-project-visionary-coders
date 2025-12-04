'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to view profile page
        router.push('/profile/view');
    }, [router]);

    return null;
}
