import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('fingrow_token') || '');

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('fingrow_token') || '');
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return token;
}
