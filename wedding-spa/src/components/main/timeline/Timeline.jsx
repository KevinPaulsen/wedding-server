// Timeline.jsx
import React from "react";
import { timelineEvents } from "./timelineData";
import TimelineItem from "./TimelineItem";
import '../../../styles/Timeline.css';

const Timeline = () => {
    const padding = 200;
    const buffer = 100;
    // Calculate a container height so the vertical line covers all items
    // For n items, the bottom item sits at (n-1)*200px + some extra padding
    const containerHeight = buffer + (timelineEvents.length - 1) * padding + buffer + 32;

    return (<div
                    className="timeline-container"
                    style={{height: containerHeight}}
            >
        {/* The spiral, absolutely positioned at the top center */}
        <div className="spiral-top">
            <svg
                    width="40"
                    height="60"
                    viewBox="0 0 40 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <path
                        d="M 20 58 V 45 C 20 42 21 41 23 40 C 43 33 38 3 17 6 C 4 8 0 21 7 28 C 11 32 25 30 25 21 C 25 14 16 12 14 20"
                        stroke="var(--main-dark)"
                        strokeWidth="4"
                        strokeLinecap="round"
                />
            </svg>
        </div>

                {timelineEvents.map((event, index) => (<TimelineItem
                                key={index}
                                position={index % 2 === 0 ? "left" : "right"}
                                topOffset={index * padding + buffer}
                                {...event} // pass time, title, location, image
                        />))}
            </div>);
};

export default Timeline;

