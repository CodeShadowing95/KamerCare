import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface LikeData {
  likes_count: number;
  is_liked: boolean;
}

export const useDoctorLikes = () => {
  const [isLoading, setIsLoading] = useState(false);

  const likeDoctor = useCallback(async (doctorId: number, token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.likeDoctor(doctorId, token);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Docteur ajouté à vos favoris",
        });
        return true;
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Impossible d'ajouter le docteur aux favoris",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unlikeDoctor = useCallback(async (doctorId: number, token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.unlikeDoctor(doctorId, token);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Docteur retiré de vos favoris",
        });
        return true;
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Impossible de retirer le docteur des favoris",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Erreur lors du unlike:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleLike = useCallback(async (doctorId: number, token: string, currentLikeStatus: boolean): Promise<boolean> => {
    if (currentLikeStatus) {
      return await unlikeDoctor(doctorId, token);
    } else {
      return await likeDoctor(doctorId, token);
    }
  }, [likeDoctor, unlikeDoctor]);

  const getLikesCount = useCallback(async (doctorId: number): Promise<number> => {
    try {
      const response = await api.getDoctorLikesCount(doctorId);
      return response.success ? response.data.likes_count : 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de likes:', {
        doctorId,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      return 0;
    }
  }, []);

  const checkIfLiked = useCallback(async (doctorId: number, token: string): Promise<boolean> => {
    try {
      const response = await api.checkIfUserLikesDoctor(doctorId, token);
      return response.success ? response.data.is_liked : false;
    } catch (error) {
      console.error('Erreur lors de la vérification du like:', error);
      return false;
    }
  }, []);

  const getLikeData = useCallback(async (doctorId: number, token?: string): Promise<LikeData> => {
    try {
      const [likesCount, isLiked] = await Promise.all([
        getLikesCount(doctorId),
        token ? checkIfLiked(doctorId, token) : Promise.resolve(false)
      ]);

      return {
        likes_count: likesCount,
        is_liked: isLiked
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données de like:', error);
      return {
        likes_count: 0,
        is_liked: false
      };
    }
  }, [getLikesCount, checkIfLiked]);

  const getUserLikedDoctors = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      const response = await api.getUserLikedDoctors(token);
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des docteurs likés:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    likeDoctor,
    unlikeDoctor,
    toggleLike,
    getLikesCount,
    checkIfLiked,
    getLikeData,
    getUserLikedDoctors,
    isLoading
  };
};