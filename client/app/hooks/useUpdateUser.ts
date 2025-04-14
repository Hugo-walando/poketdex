import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Assurez-vous d'utiliser Auth.js pour la gestion de session
import axios from 'axios';
import axiosClient from '@/lib/axios';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/useUserStore';

// Hook pour mettre à jour l'utilisateur
const useUpdateUser = () => {
  const { update } = useSession();
  const user = useUserStore((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateUser = async (userData: {
    username: string;
    friend_code: string;
  }) => {
    if (!user?.accessToken) {
      setError('Utilisateur non authentifié');
      toast.error('Erreur : utilisateur non authentifié');

      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosClient.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        },
      );

      await update(); // rafraîchit la session côté front
      setSuccess('✅ Informations mises à jour avec succès');
      toast.success('Informations mises à jour avec succès');
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message ||
            "Erreur lors de la mise à jour de l'utilisateur",
        );
      } else {
        setError("Erreur lors de la mise à jour de l'utilisateur");
        toast.error("Erreur lors de la mise à jour de l'utilisateur");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, success };
};

export default useUpdateUser;
