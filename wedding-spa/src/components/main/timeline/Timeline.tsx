// Timeline.jsx
import React from "react";
import { timelineEvents } from "./timelineData";
import TimelineItem from "./TimelineItem";
import '../../../styles/Timeline.css';

const Timeline: React.FC = () => {
    const padding = 150;
    const buffer = 125;
    const containerHeight = 50 + padding + buffer + (timelineEvents.length - 2) * padding + 100;

    return (
        <div className="timeline-container" style={{ height: containerHeight }}>
            <div className="spiral-top">
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M 20 58 V 45 C 20 42 21 41 23 40 C 43 33 38 3 17 6 C 4 8 0 21 7 28 C 13 35 25 30 25 21 C 25 14 16 12 14 20"
                        stroke="var(--main-dark)"
                        strokeWidth="var(--line-width)"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            {timelineEvents.map((event, index) => {
                const isLast = index === timelineEvents.length - 1;
                const position = isLast ? "center" : index % 2 === 1 ? "left" : "right";
                return (
                    <TimelineItem
                        key={index}
                        position={position}
                        topOffset={index * padding + buffer}
                        {...event}
                    />
                );
            })}
        </div>
    );
};

export default Timeline;
