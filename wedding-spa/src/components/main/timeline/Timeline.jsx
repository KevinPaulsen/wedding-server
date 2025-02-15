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
                {timelineEvents.map((event, index) => (<TimelineItem
                                key={index}
                                position={index % 2 === 0 ? "left" : "right"}
                                topOffset={index * padding + buffer}
                                {...event} // pass time, title, location, image
                        />))}
            </div>);
};

export default Timeline;

