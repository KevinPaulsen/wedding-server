import React, { useState, useEffect } from 'react';

const Countdown = () => {
    const calculateTimeLeft = () => {
        const weddingDate = new Date('2025-09-13T10:00:00');
        const now = new Date();
        const difference = weddingDate - now;

        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return (
        <div className="bg-dark text-white py-4">
            <h3 className="text-center mb-4">Countdown</h3>
            <div className="container d-flex justify-content-around">
                <div className="text-center">
                    <h5>{timeLeft.days || 0}</h5>
                    <p>Days</p>
                </div>
                <div className="text-center">
                    <h5>{timeLeft.hours || 0}</h5>
                    <p>Hours</p>
                </div>
                <div className="text-center">
                    <h5>{timeLeft.minutes || 0}</h5>
                    <p>Minutes</p>
                </div>
                <div className="text-center">
                    <h5>{timeLeft.seconds || 0}</h5>
                    <p>Seconds</p>
                </div>
            </div>
        </div>
    );
};

export default Countdown;

