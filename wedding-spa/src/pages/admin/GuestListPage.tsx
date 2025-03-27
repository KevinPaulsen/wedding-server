// pages/admin/GuestListPage.tsx
import React, { useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminGuestController from '../../components/admin/adminGuestTable/AdminGuestController';
import { useAdminData } from '../../context/AdminDataContext';

const GuestListPage: React.FC = () => {
  const { data: rsvps, loading, error } = useAdminData();

  // Compute a grouped stats structure using useMemo
  const statsData = useMemo(() => {
    if (loading || error) return null;
    let totalGuests = 0;
    const events = ['roce', 'rehearsal', 'ceremony', 'reception'] as const;
    const eventStats: Record<string, { pending: number; coming: number; notComing: number }> = {
      roce: { pending: 0, coming: 0, notComing: 0 },
      rehearsal: { pending: 0, coming: 0, notComing: 0 },
      ceremony: { pending: 0, coming: 0, notComing: 0 },
      reception: { pending: 0, coming: 0, notComing: 0 },
    };

    rsvps.forEach((rsvp) => {
      const guestCount = Object.keys(rsvp.guest_list).length;
      totalGuests += guestCount;

      events.forEach((eventKey) => {
        const event = rsvp[eventKey];
        if (!event.invited) return;
        if (!rsvp.submitted) {
          eventStats[eventKey].pending += guestCount;
        } else {
          const comingCount = event.guests_attending.length;
          const notComingCount = guestCount - comingCount;
          eventStats[eventKey].coming += comingCount;
          eventStats[eventKey].notComing += notComingCount;
        }
      });
    });

    return { totalGuests, events: eventStats };
  }, [rsvps, loading, error]);

  if (loading) return <div>Loading...</div>;
  if (error || !statsData) return <div>Error: {error}</div>;

  return (
      <AdminLayout stats={statsData}>
        <AdminGuestController />
      </AdminLayout>
  );
};

export default GuestListPage;
