import React from 'react';
import Header from './components/Header';
import PhotoSection from './components/PhotoSection';
import Schedule from './components/Schedule';
import WeddingDetails from './components/WeddingDetails';
import Countdown from './components/Countdown';

function App() {
    return (
        <div className="App">
            <Header />
            <PhotoSection />
            <Schedule />
            <WeddingDetails />
            <Countdown />
        </div>
    );
}

export default App;
