import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

const StudioContext = createContext();

export const useStudio = () => useContext(StudioContext);

export const StudioProvider = ({ children }) => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bütün studioları al
  const fetchStudios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('studios')
        .select('*');

      if (error) {
        throw error;
      }

      setStudios(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching studios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Studio əlavə et
  const addStudio = async (studioData) => {
    try {
      const studioWithDefaultPrice = {
        ...studioData,
        price: '0' // Hər zaman default olaraq '0' təyin edirik
      };

      const { data, error } = await supabase
        .from('studios')
        .insert([studioWithDefaultPrice])
        .select();

      if (error) {
        throw error;
      }

      setStudios(prev => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError(err.message);
      console.error('Error adding studio:', err);
      throw err;
    }
  };

  // Studio yenilə
  const updateStudio = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('studios')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setStudios(prev => prev.map(studio => 
        studio.id === id ? data[0] : studio
      ));
      return data[0];
    } catch (err) {
      setError(err.message);
      console.error('Error updating studio:', err);
      throw err;
    }
  };

  // Studio sil
  const deleteStudio = async (id) => {
    try {
      const { error } = await supabase
        .from('studios')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setStudios(prev => prev.filter(studio => studio.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting studio:', err);
      throw err;
    }
  };

  // Statistikanı yenilə
  const updateStats = async (studioId, statType) => {
    try {
      const { data: studio } = await supabase
        .from('studios')
        .select('*')
        .eq('id', studioId)
        .single();

      if (!studio) return;

      const currentStats = studio.stats || {};
      const newStats = {
        ...currentStats,
        [statType]: (currentStats[statType] || 0) + 1
      };

      const { error } = await supabase
        .from('studios')
        .update({ stats: newStats })
        .eq('id', studioId);

      if (error) throw error;

      setStudios(prev => prev.map(s => 
        s.id === studioId 
          ? { ...s, stats: newStats }
          : s
      ));
    } catch (err) {
      console.error('Error updating stats:', err);
    }
  };

  // Studio ID-yə görə al
  const getStudioById = (id) => {
    return studios.find(studio => studio.id === parseInt(id));
  };

  // Şəkil yüklə
  const uploadImage = async (file) => {
    try {
      // Session yoxlaması
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Şəkil yükləmək üçün daxil olmalısınız');
      }

      if (!file) {
        throw new Error('Fayl seçilməyib');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Fayl ölçüsü 5MB-dan çox olmamalıdır');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Yalnız JPG və PNG faylları dəstəklənir');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('studio-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Şəkil yüklənərkən xəta baş verdi');
      }

      const { data: urlData } = supabase.storage
        .from('studio-images')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Public URL alınarkən xəta baş verdi');
      }

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error in uploadImage:', err);
      throw err;
    }
  };

  // İlk yükləmədə studioları al
  useEffect(() => {
    fetchStudios();
  }, []);

  const value = {
    studios,
    loading,
    error,
    fetchStudios,
    addStudio,
    updateStudio,
    deleteStudio,
    updateStats,
    getStudioById,
    uploadImage
  };

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  );
};
