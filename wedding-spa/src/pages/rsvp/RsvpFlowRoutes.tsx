// RsvpFlowRoutes.tsx (new file in /pages/rsvp/)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RsvpVerificationPage from './RsvpVerificationPage';
import RsvpPrimaryContactPage from './RsvpPrimaryContactPage';
import RsvpGuestDetailsPage from './RsvpGuestDetailsPage';
import RsvpRocePage from './RsvpRocePage';
import RsvpRehearsalPage from './RsvpRehearsalPage';
import RsvpCeremonyPage from './RsvpCeremonyPage';
import RsvpReceptionPage from './RsvpReceptionPage';
import RsvpConfirmation from './RsvpConfirmation';

const RsvpFlowRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="verification" element={<RsvpVerificationPage />} />
            <Route path="primary" element={<RsvpPrimaryContactPage />} />
            <Route path="guests" element={<RsvpGuestDetailsPage />} />
            <Route path="roce" element={<RsvpRocePage />} />
            <Route path="rehearsal" element={<RsvpRehearsalPage />} />
            <Route path="ceremony" element={<RsvpCeremonyPage />} />
            <Route path="reception" element={<RsvpReceptionPage />} />
            <Route path="confirmation" element={<RsvpConfirmation />} />
            <Route path="*" element={<Navigate to="verification" replace />} />
        </Routes>
    );
};

export default RsvpFlowRoutes;
