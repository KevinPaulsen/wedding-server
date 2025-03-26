// pages/admin/GuestListPage.tsx
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminGuestController from "../../components/admin/adminGuestTable/AdminGuestController";

const GuestListPage: React.FC = () => {
  return (
      <AdminLayout>
        <AdminGuestController />
      </AdminLayout>
  );
};

export default GuestListPage;
