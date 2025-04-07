import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Assurez-vous d'utiliser Auth.js pour la gestion de session
import axios from 'axios';

// Hook pour mettre à jour l'utilisateur
const useUpdateUser = () => {
  const { data: session } = useSession(); // Récupère les données de la session utilisateur
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fonction pour mettre à jour les informations utilisateur
  const updateUser = async (userData: {
    pseudo: string;
    friend_code: string;
  }) => {
    if (!session?.accessToken) {
      // Vérifie que l'utilisateur est authentifié et qu'il a un token
      setError('Utilisateur non authentifié');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Requête PATCH pour mettre à jour les informations utilisateur
      const response = await axios.patch(
        `http://localhost:5000/api/users/${session.user.id}`, // L'ID de l'utilisateur est récupéré depuis la session
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`, // Ajoute le access_token dans l'en-tête Authorization
          },
        },
      );

      // Réponse réussie
      setSuccess('Informations mises à jour avec succès !');
      return response.data;
    } catch (err: any) {
      // Gestion des erreurs
      setError("Erreur lors de la mise à jour de l'utilisateur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, success };
};

export default useUpdateUser;
