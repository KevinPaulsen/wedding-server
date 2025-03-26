// components/main/timeline/TimelineItem.tsx
import React from "react";
import '../../../styles/Timeline.css';
import {Box, Typography, useMediaQuery, useTheme} from "@mui/material";

interface TimelineDetailsProps {
  image: string;
  time: string;
  title: string;
  location?: string;
  height?: number;
  position: "left" | "right" | "center";
}

const TimelineDetails: React.FC<TimelineDetailsProps> = ({
                                                           image,
                                                           time,
                                                           title,
                                                           location,
                                                           height = 130,
                                                           position
                                                         }) => {
  const isXs = useMediaQuery(`(max-width: ${400}px)`);

  return (
      <>
        <Box sx={{
          minHeight: height,
          alignContent: "end",
          display: "flex",
          justifyContent: position === 'left' ? 'flex-end' : position === 'right' ? 'flex-start' : 'center',
          alignItems: "end",
          pb: 1,
        }}>
          <div
              className="icon"
              style={{
                WebkitMask: `url(${image}) no-repeat center/contain`,
                mask: `url(${image}) no-repeat center/contain`,
              }}
          />
        </Box>
        <Typography variant="h6" sx={{display: "inline-block"}}>{time}</Typography>
        <Box sx={{
          minHeight: height,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Typography variant={isXs ? "body1" : "h6"}
                      color="primary.main"
                      sx={{display: "inline-block"}}
          >
            {title}
          </Typography>
          <Typography variant={isXs ? "body2" : "body1"}
                      color="primary.light"
                      sx={{display: "inline-block"}}
          >
            {location}
          </Typography>
        </Box>
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

const TimelineItem: React.FC<TimelineItemProps> = ({
                                                     position,
                                                     topOffset,
                                                     time,
                                                     title,
                                                     location,
                                                     image
                                                   }) => {
  if (position === "center") {
    return (
        <Box className="timeline-item center">
          <TimelineDetails image={image} location={location} time={time} title={title} height={0}
                           position={position}/>
        </Box>
    );
  }

  const halfArcClass = position === "left" ? "right-half" : "left-half";

  return (
      <div className={`timeline-item ${position}`} style={{top: topOffset}}>
        <div className="intersection">
          <div className="circle circle-1"/>
          <div className="circle circle-2"/>
          <div className="circle circle-3"/>
          <div className={`arc half ${halfArcClass}`}/>
        </div>
        <Box className="event-content">
          <TimelineDetails image={image} location={location} time={time} title={title}
                           position={position}/>
        </Box>
      </div>
  );
};

export default TimelineItem;
