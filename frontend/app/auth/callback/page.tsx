'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      Cookies.set('auth_token', token, { expires: 7, secure: true });
      router.push('/dashboard');
    }
  }, []);

  return <p>Signing you in...</p>;
}
