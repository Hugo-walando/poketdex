import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '@/lib/axios';
import toast from 'react-hot-toast';
import { Set } from '@/app/types/index'; // <-- import propre
import { useSession } from 'next-auth/react';

const useFetchSets = () => {
  const { data: session, status } = useSession();
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (sets.length > 0) return;
    if (status == 'authenticated') {
      const fetchSets = async () => {
        if (!session?.accessToken) {
          setError('Utilisateur non authentifié');
          toast.error('Erreur : utilisateur non authentifié');

          return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
          console.log('Fetching sets...');
          const response = await axiosClient.get<Set[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/sets`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
              },
              withCredentials: true,
            },
          );

          setSets(response.data);

          setSuccess('✅ Sets chargés avec succès');
          toast.success('Sets chargés avec succès');
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            setError(
              err.response.data?.message ||
                'Erreur lors du chargement des sets',
            );
            toast.error(
              err.response.data?.message ||
                'Erreur lors du chargement des sets',
            );
          } else {
            setError('Erreur lors du chargement des sets');
            toast.error('Erreur lors du chargement des sets');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchSets();
    }
  }, [status, session]);

  return { sets, loading, error, success };
};
export default useFetchSets;
