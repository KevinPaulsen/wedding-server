// TimelineItem.jsx
import React from "react";
import '../../../styles/Timeline.css';

const TimelineItem = ({
    position,
    topOffset,
    time,
    title,
    location,
    image
}) => {
    // Determine which half arc class to use (left item => right half arc, and vice versa)
    const halfArcClass = position === "left" ? "right-half" : "left-half";

    return (
            <div className={`timeline-item ${position}`} style={{ top: topOffset }}>
                <div className="intersection">
                    {/* The 3 circles (bullseye) */}
                    <div className="circle circle-1" />
                    <div className="circle circle-2" />
                    <div className="circle circle-3" />
                    {/* The half arc that alternates sides */}
                    <div className={`arc half ${halfArcClass}`} />

                </div>

                {/* Event details container */}
                <div className="event-content">
                    {/* Optional: show image if provided */}
                    {image && <img src={image} alt={title} className="event-image" />}
                    <div className="event-time-title">
                        {time} {title}
                    </div>
                    <div className="event-location">{location}</div>
                </div>
            </div>
    );
};

export default TimelineItem;