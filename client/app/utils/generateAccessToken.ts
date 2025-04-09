// utils/generateToken.ts
import jwt from 'jsonwebtoken';
import { User } from 'next-auth';

export const generateAccessToken = (user: User) => {
  const payload = {
    email: user.email, // Email de l'utilisateur
    id: user.id, // ID de l'utilisateur
    role: user.role || 'user', // Le rôle de l'utilisateur (si nécessaire)
  };

  const secret = process.env.AUTH_SECRET; // La clé secrète pour signer ton JWT
  if (!secret) {
    throw new Error('AUTH_SECRET is not defined in the environment variables');
  }

  // Créer un JWT avec une expiration d'une heure
  const token = jwt.sign(payload, secret, { expiresIn: '5m' });

  return token;
};
