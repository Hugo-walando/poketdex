import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '@/lib/axios';
import toast from 'react-hot-toast';
import { Set } from '@/app/types/index'; // <-- import propre

const useFetchSets = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSets = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosClient.get<Set[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sets`,
      );

      setSets(response.data);
      setSuccess('✅ Sets chargés avec succès');
      toast.success('Sets chargés avec succès');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message || 'Erreur lors du chargement des sets',
        );
        toast.error(
          err.response.data?.message || 'Erreur lors du chargement des sets',
        );
      } else {
        setError('Erreur lors du chargement des sets');
        toast.error('Erreur lors du chargement des sets');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  return { sets, loading, error, success };
};

export default useFetchSets;
