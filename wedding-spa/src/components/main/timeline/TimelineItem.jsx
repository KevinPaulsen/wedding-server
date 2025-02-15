// TimelineItem.jsx
import React from "react";
import '../../../styles/Timeline.css';
import {Container, Row} from "react-bootstrap";

const TimelineDetails = ({image, time, title, location, height=130}) => {
    return <>
        <Row className="event-image" style={{minHeight: height}}>
            <img src={image} alt={title}/>
        </Row>
        <Row className="m-0 event-time">{time}</Row>
        <Container className="m-0 g-0" style={{ minHeight: height}} >
            <div className="event-title">
                {title}
            </div>

            <div className="event-location">
                {location}
            </div>
        </Container>
    </>
}

const TimelineItem = ({
    position, topOffset, time, title, location, image
}) => {
    // If it's center, we skip arcs & intersection
    if (position === "center") {
        return (
                <Container className="timeline-item center">
                    <TimelineDetails image={image} location={location} time={time} title={title} height={0}/>
                </Container>
                );
    }

    // Determine which half arc class to use (left item => right half arc, and vice versa)
    const halfArcClass = position === "left" ? "right-half" : "left-half";

    return (<div className={`timeline-item ${position}`} style={{top: topOffset}}>
        <div className="intersection">
            {/* The 3 circles (bullseye) */}
            <div className="circle circle-1"/>
            <div className="circle circle-2"/>
            <div className="circle circle-3"/>
            {/* The half arc that alternates sides */}
            <div className={`arc half ${halfArcClass}`}/>
        </div>

        <Container className="event-content">
            <TimelineDetails image={image} location={location} time={time} title={title}/>
        </Container>


        {/* Event details container */}
        <div className="event-content">
        </div>
    </div>);
};

export default TimelineItem;