// hooks/useFetchSets.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from '@/lib/axios';
import toast from 'react-hot-toast';
import { Set } from '@/app/types/index';
import { useUserStore } from '../store/useUserStore';

const useFetchSets = () => {
  const user = useUserStore((state) => state.user);

  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<Set[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sets`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
            withCredentials: true,
          },
        );

        setSets(response.data);
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Erreur lors du chargement des sets';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [user]);

  return { sets, loading, error };
};

export default useFetchSets;
