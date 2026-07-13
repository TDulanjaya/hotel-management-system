import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/api/authApi';

export function useReservations() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch(`/api/${'reservations'}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
