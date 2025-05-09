// pages/admin/AdminRsvpInfoPage.tsx
import React, {useMemo} from 'react';
import {useTheme} from '@mui/material';
import AdminLayout from '../../components/admin/AdminLayout';
import {useAdminData} from '../../context/AdminDataContext';
import RsvpTable from "../../components/admin/adminRsvpTable/RsvpTable";

const AdminRsvpInfoPage: React.FC = () => {
  const { data: rsvps, loading, error } = useAdminData();
  const theme = useTheme();

  const statsData = useMemo(() => {
    if (loading || error) return null;

    const totalInvitations = rsvps.length;
    const pendingInvitations = rsvps.filter(rsvp => !rsvp.submitted).length;
    let comingInvitations = 0;
    let notComingInvitations = 0;

    // For each submitted RSVP, decide if they are coming or not.
    rsvps.forEach(rsvp => {
      if (rsvp.submitted) {
        // Check if any event (roce, rehearsal, ceremony, reception) has guests_attending.
        const events = ['roce', 'rehearsal', 'ceremony', 'reception'] as const;
        const hasComing = events.some(eventKey => rsvp[eventKey].guests_attending.length > 0);
        if (hasComing) {
          comingInvitations += 1;
        } else {
          notComingInvitations += 1;
        }
      }
    });

    // Calculate days until deadline (June 15, 2025).
    const deadline = new Date(2025, 5, 15); // month is 0-indexed: 5 = June.
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Build the new stats object.
    return {
      mainStatName: 'Invitations',
      mainStatData: totalInvitations,
      smallStats: [
        {
          statName: "Total Coming",
          data: [{
            statData: comingInvitations,
            color: theme.palette.success.main,
          }],
        },
        {
          statName: 'Total Pending',
          data: [{
            statData: pendingInvitations,
            color: theme.palette.info.main,
          }],
        },
        {
          statName: 'Total Not Coming',
          data: [{
            statData: notComingInvitations,
            color: theme.palette.error.main,
          }],
        },
        {
          statName: 'Days Until Deadline',
          data: [{statData: daysUntilDeadline}],
        },
      ],
    };
  }, [rsvps, loading, error, theme]);

  return (
      <AdminLayout stats={statsData}>
        <RsvpTable />
      </AdminLayout>
  );
};

export default AdminRsvpInfoPage;
