// TimelineItem.jsx
import React from "react";
import '../../../styles/Timeline.css';
import {Container, Row} from "react-bootstrap";

const TimelineDetails = ({image, time, title, location}) => {
    return <>
        <Row>
            {image && <img src={image} alt={title} className="event-image"/>}
        </Row>
        <Row className="event-time">{time}</Row>
        <Row className="event-title">{title}</Row>
        <Row className="event-location">
            {location}
        </Row>
    </>
}

const TimelineItem = ({
    position, topOffset, time, title, location, image
}) => {
    // If it's center, we skip arcs & intersection
    if (position === "center") {
        return (
                <Container className="timeline-item center">
                    <TimelineDetails image={image} location={location} time={time} title={title}/>
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