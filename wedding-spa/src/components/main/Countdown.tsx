// components/main/Countdown.tsx
import React, { useEffect, useState } from 'react';
import InfoContainer from "./InfoContainer";

const Countdown: React.FC = () => {
    const calculateTimeLeft = () => {
        const weddingDate = new Date('2025-09-13T10:00:00');
        const now = new Date();
        const difference = weddingDate.getTime() - now.getTime();

        let timeLeft: { days?: number; hours?: number; minutes?: number; seconds?: number } = {};
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

    const schedule = [
        { header: timeLeft.days ?? 0, body: 'Days' },
        { header: timeLeft.hours ?? 0, body: 'Hours' },
        { header: timeLeft.minutes ?? 0, body: 'Minutes' },
        { header: timeLeft.seconds ?? 0, body: 'Seconds' },
    ];

    return (
        <div className="bg-dark text-white py-4">
            <InfoContainer title="Countdown" elements={schedule} />
        </div>
    );
};

export default Countdown;
