// components/main/timeline/TimelineItem.tsx
import React from "react";
import '../../../styles/Timeline.css';
import {Box, Typography, useMediaQuery} from "@mui/material";

interface TimelineDetailsProps {
  image: string;
  time: string;
  title: string;
  location?: string;
  address?: string;
  height?: number;
  position: "left" | "right" | "center";
}

const getMapLink = (address: string) => {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent;
    // Check if the device is mobile
    const isMobile = /Mobi|Android|iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    if (isMobile) {
      if (isAndroid) {
        // Android: use the geo scheme to launch the default maps app.
        return `geo:0,0?q=${encodeURIComponent(address)}`;
      }
      if (isIOS) {
        // iOS: use Apple Maps.
        return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
      }
    }
  }
  // Desktop fallback: use Google Maps HTTPS.
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
};

const TimelineDetails: React.FC<TimelineDetailsProps> = ({
                                                           image,
                                                           time,
                                                           title,
                                                           location,
                                                           address,
                                                           height = 130,
                                                           position,
                                                         }) => {
  const isXs = useMediaQuery(`(max-width: 400px)`);

  return (
      <>
        <Box
            sx={{
              minHeight: height,
              alignContent: "end",
              display: "flex",
              justifyContent:
                  position === "left"
                      ? "flex-end"
                      : position === "right"
                          ? "flex-start"
                          : "center",
              alignItems: "end",
              pb: 1,
            }}
        >
          <div
              className="icon"
              style={{
                WebkitMask: `url(${image}) no-repeat center/contain`,
                mask: `url(${image}) no-repeat center/contain`,
              }}
          />
        </Box>
        <Typography variant="h6" sx={{ display: "inline-block" }}>
          {time}
        </Typography>
        <Box
            sx={{
              minHeight: height,
              display: "flex",
              flexDirection: "column",
            }}
        >
          <Typography
              variant={isXs ? "body1" : "h6"}
              color="primary.main"
              sx={{ display: "inline-block" }}
          >
            {title}
          </Typography>
          <Typography
              variant={isXs ? "body2" : "body1"}
              color="primary.light"
              sx={{ display: "inline-block" }}
          >
            {address ? (
                <a
                    href={getMapLink(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                  {location}
                </a>
            ) : (
                location
            )}
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
  address?: string;
  image: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
                                                     position,
                                                     topOffset,
                                                     time,
                                                     title,
                                                     location,
                                                     address,
                                                     image,
                                                   }) => {
  if (position === "center") {
    return (
        <Box className="timeline-item center">
          <TimelineDetails
              image={image}
              location={location}
              address={address}
              time={time}
              title={title}
              height={0}
              position={position}
          />
        </Box>
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
        <Box className="event-content">
          <TimelineDetails
              image={image}
              location={location}
              address={address}
              time={time}
              title={title}
              position={position}
          />
        </Box>
      </div>
  );
};

export default TimelineItem;
