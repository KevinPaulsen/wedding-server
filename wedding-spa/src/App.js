import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PhotoSection from './components/PhotoSection';
import Schedule from './components/Schedule';
import WeddingDetails from './components/WeddingDetails';
import Countdown from './components/Countdown';
import RSVPCodePage from './components/RSVPCodePage';
import PreferredInfoPage from './components/PreferredInfoPage';
import StatusPage from './components/StatusPage';
import ConfirmationPage from './components/ConfirmationPage';
import {FlowProvider} from "./FlowProvider";

function App() {
    return (
        <FlowProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <div>
                            <Header />
                            <PhotoSection />
                            <Schedule />
                            <WeddingDetails />
                            <Countdown />
                        </div>
                    } />
                    <Route path="/rsvp" element={<RSVPCodePage />} />
                    <Route path="/rsvp-info" element={<PreferredInfoPage />} />
                    <Route path="/rsvp-status" element={<StatusPage />} />
                    <Route path="/rsvp-confirmation" element={<ConfirmationPage />} />
                </Routes>
            </Router>
        </FlowProvider>
    );
}

export default App;
