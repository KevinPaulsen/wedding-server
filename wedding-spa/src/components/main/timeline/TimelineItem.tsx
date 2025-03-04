// TimelineItem.jsx
import React from "react";
import '../../../styles/Timeline.css';
import { Container, Row } from "react-bootstrap";

interface TimelineDetailsProps {
    image: string;
    time: string;
    title: string;
    location?: string;
    height?: number;
}

const TimelineDetails: React.FC<TimelineDetailsProps> = ({ image, time, title, location, height = 130 }) => {
    return (
        <>
            <Row className="event-image" style={{ minHeight: height }}>
                <img src={image} alt={title} />
            </Row>
            <Row className="m-0 event-time">{time}</Row>
            <Container className="m-0 g-0" style={{ minHeight: height }}>
                <div className="event-title">{title}</div>
                <div className="event-location">{location}</div>
            </Container>
        </>
    );
};


interface TimelineItemProps {
    position: "left" | "right" | "center";
    topOffset: number;
    time: string;
    title: string;
    location?: string;
    image: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ position, topOffset, time, title, location, image }) => {
    if (position === "center") {
        return (
            <Container className="timeline-item center">
                <TimelineDetails image={image} location={location} time={time} title={title} height={0} />
            </Container>
        );
    }

    const halfArcClass = position === "left" ? "right-half" : "left-half";

    return (
        <div className={`timeline-item ${position}`} style={{ top: topOffset }}>
            <div className="intersection">
                <div className="circle circle-1" />
                <div className="circle circle-2" />
                <div className="circle circle-3" />
                <div className={`arc half ${halfArcClass}`} />
            </div>
            <Container className="event-content">
                <TimelineDetails image={image} location={location} time={time} title={title} />
            </Container>
            <div className="event-content"></div>
        </div>
    );
};

export default TimelineItem;
