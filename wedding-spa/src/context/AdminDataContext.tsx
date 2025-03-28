import React, {createContext, useContext} from 'react';
import {useRsvpData} from '../hooks/rsvp/useRsvpData';
import {useEditRsvp} from '../hooks/rsvp/useEditRsvp';
import {useDeleteRsvp} from '../hooks/rsvp/useDelete';
import {useCreateRsvp} from '../hooks/rsvp/useCreateRsvp';
import {useCreateAllRsvps} from '../hooks/rsvp/useCreateAllRsvps';
import {Rsvp} from '../types/rsvp';
import {CreateRsvpDTO} from '../types/RsvpDTO';

interface AdminDataContextProps {
  data: Rsvp[];
  loading: boolean;
  error: string | null;
  addRsvp: (rsvp: Rsvp) => void;
  removeRsvp: (rsvpCode: string) => void;
  updateRsvpInState: (updatedRsvp: Rsvp) => void;
  editRsvp: (updatedRsvp: Rsvp) => Promise<any>;
  editLoading: boolean;
  editError: string | null;
  deleteRsvp: (rsvpCode: string) => Promise<any>;
  deleteLoading: boolean;
  deleteError: string | null;
  createRsvp: (createDTO: CreateRsvpDTO) => Promise<any>;
  createLoading: boolean;
  createError: string | null;
  createAllRsvps: (file: File) => Promise<any>;
  createAllLoading: boolean;
  createAllError: string | null;
}

const AdminDataContext = createContext<AdminDataContextProps | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Manage the RSVP list and its state.
  const rsvpData = useRsvpData();

  // Use our API hooks that already include loading and error states.
  const { execute: editRsvpApi, loading: editLoading, error: editError } = useEditRsvp();
  const { execute: deleteRsvpApi, loading: deleteLoading, error: deleteError } = useDeleteRsvp();
  const { execute: createRsvpApi, loading: createLoading, error: createError } = useCreateRsvp();
  const { execute: createAllRsvpsApi, loading: createAllLoading, error: createAllError } = useCreateAllRsvps();

  const editRsvp = async (updatedRsvp: Rsvp) => {
    const response = await editRsvpApi(updatedRsvp);
    if (response.success) {
      rsvpData.updateRsvpInState(response.data as Rsvp);
    }
    return response;
  };

  const deleteRsvp = async (rsvpCode: string) => {
    const response = await deleteRsvpApi(rsvpCode);
    if (response.success) {
      rsvpData.removeRsvp(rsvpCode);
    }
    return response;
  };

  const createRsvp = async (createDTO: CreateRsvpDTO) => {
    const response = await createRsvpApi(createDTO);
    if (response.success) {
      rsvpData.addRsvp(response.data as Rsvp);
    }
    return response;
  };

  const createAllRsvps = async (file: File) => {
    const response = await createAllRsvpsApi(file);

    if (response.success && response.data) {
      response.data.forEach((rsvp: Rsvp) => {
        rsvpData.addRsvp(rsvp);
      });
    }

    return response;
  };

  const value: AdminDataContextProps = {
    data: rsvpData.data,
    loading: rsvpData.loading,
    error: rsvpData.error,
    addRsvp: rsvpData.addRsvp,
    removeRsvp: rsvpData.removeRsvp,
    updateRsvpInState: rsvpData.updateRsvpInState,
    editRsvp,
    editLoading,
    editError,
    deleteRsvp,
    deleteLoading,
    deleteError,
    createRsvp,
    createLoading,
    createError,
    createAllRsvps,
    createAllLoading,
    createAllError,
  };

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
};

export const useAdminData = (): AdminDataContextProps => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
