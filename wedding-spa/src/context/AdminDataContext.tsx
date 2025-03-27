// context/AdminDataContext.tsx
import React, { createContext, useContext } from 'react';
import { useRsvpData } from '../hooks/rsvp/useRsvpData';
import { Rsvp } from '../types/rsvp';

interface AdminDataContextProps {
  data: Rsvp[];
  loading: boolean;
  error: string | null;
  addRsvp: (rsvp: Rsvp) => void;
  removeRsvp: (rsvpCode: string) => void;
  updateRsvpInState: (updatedRsvp: Rsvp) => void;
}

const AdminDataContext = createContext<AdminDataContextProps | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // useRsvpData fetches and manages the RSVP data once.
  const rsvpData = useRsvpData();
  return (
      <AdminDataContext.Provider value={rsvpData}>
        {children}
      </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextProps => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
