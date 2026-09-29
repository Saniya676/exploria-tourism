import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoriteService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SavedContext = createContext();

export function SavedProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [savedIds, setSavedIds] = useState([]);
  const [savedPackages, setSavedPackages] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSaved();
    } else {
      setSavedIds([]);
      setSavedPackages([]);
    }
  }, [user]);

  async function fetchSaved() {
    try {
      const res = await favoriteService.getMy();
      if (res.success) {
        setSavedPackages(res.data);
        setSavedIds(res.data.map(p => p.id));
      }
    } catch (err) {
      // silently handle unauth
    }
  }

  async function toggleFavorite(packageId) {
    if (!user) {
      showToast('Please login to save packages to your favorites', 'info');
      return false;
    }

    try {
      const res = await favoriteService.toggle(packageId);
      if (res.success) {
        showToast(res.message, 'success');
        await fetchSaved();
        return res.isSaved;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update favorites', 'error');
    }
    return false;
  }

  function isSaved(packageId) {
    return savedIds.includes(Number(packageId));
  }

  return (
    <SavedContext.Provider value={{ savedIds, savedPackages, toggleFavorite, isSaved, fetchSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}
