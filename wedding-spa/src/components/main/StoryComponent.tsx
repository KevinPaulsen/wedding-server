import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
// Example icons...
import SchoolIcon from "@mui/icons-material/School";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface StoryStep {
  label: string;
  shortDescription: string;
  longDescription: string;
  icon: React.ReactElement;
  image?: string;
}

export const storySteps: StoryStep[] = [
  {
    label: "The First Mystery",
    shortDescription:
        "We met at the Newman Center—Kevin a freshman, Olivia a sophomore—but no one remembers exactly when!",
    longDescription:
        "Kevin’s earliest memory is of Olivia and some upperclassmen convincing him she and Daphne were sisters. We still have no proof they aren’t. Regardless, it set the stage for everything that followed.",
    icon: <SchoolIcon fontSize="large" />,
    image:
        "https://paulsen-wedding-photo-gallery.s3.us-west-2.amazonaws.com/images/Olivia-Kevin-Engagement-105.jpeg",
  },
  {
    label: "Wedding Spark",
    shortDescription:
        "Our friend groups merged on a wedding trip, and Kevin quickly realized Olivia's humor and passion were irresistible.",
    longDescription:
        "At a mutual friend’s wedding, Kevin discovered Olivia's unique charm—her hilarious hot takes (especially her humorous disdain for the Midwest) instantly captivated him.",
    icon: <CelebrationIcon fontSize="large" />,
    image:
        "https://paulsen-wedding-photo-gallery.s3.us-west-2.amazonaws.com/images/Olivia-Kevin-Engagement-105.jpeg",
  },
  {
    label: "Fast & Focused",
    shortDescription:
        "Olivia’s dating fast for her peer ministry left Kevin in a bind—so he joined a dating fast himself and enrolled in FOCUS.",
    longDescription:
        "Inspired by Olivia’s commitment, Kevin decided to start his own dating fast by joining FOCUS. But just before leaving for training, he confessed his feelings. Olivia kept him in suspense for a whole week before admitting she liked him back.",
    icon: <HourglassEmptyIcon fontSize="large" />,
    image:
        "https://paulsen-wedding-photo-gallery.s3.us-west-2.amazonaws.com/images/Olivia-Kevin-Engagement-105.jpeg",
  },
  {
    label: "No-Date Dilemma",
    shortDescription:
        "We initially agreed to stay friends until Kevin’s mission ended—but our connection was too strong to resist.",
    longDescription:
        "Despite promising to wait until Kevin returned from his mission, the magnetic pull between us made silence unbearable. We quickly acknowledged our love, even if it meant surviving a year-long conversation limit of 1.5 hours per week!",
    icon: <PeopleIcon fontSize="large" />,
    image:
        "https://paulsen-wedding-photo-gallery.s3.us-west-2.amazonaws.com/images/Olivia-Kevin-Engagement-105.jpeg",
  },
  {
    label: "Rooftop Surprise",
    shortDescription:
        "On August 3, 2024, Kevin surprised Olivia on a sunset rooftop—turning a playful 'maybe' into an enthusiastic 'yes!'",
    longDescription:
        "Kevin orchestrated a breathtaking proposal on the rooftop of the Graduate Hotel. With Olivia expecting him to have left for Baltimore, the surprise unfolded against a stunning sunset. After a playful 'maybe,' her enthusiastic 'yes' sealed our forever.",
    icon: <EmojiEventsIcon fontSize="large" />,
    image:
        "https://paulsen-wedding-photo-gallery.s3.us-west-2.amazonaws.com/images/Olivia-Kevin-Engagement-105.jpeg",
  },
];

const StoryComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // A single piece of state:
  // - page = which step index we’re on
  // - direction = +1 forward, -1 backward
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animate left or right
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
    }),
  };

  const handleStep = (nextStep: number) => {
    if (nextStep === page) return;
    setDirection(nextStep > page ? 1 : -1);
    setPage(nextStep);

    setExpanded(false);
    setImageLoaded(false);
  };

  const toggleExpanded = () => setExpanded(!expanded);

  // For swipe left/right
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (page < storySteps.length - 1) {
        handleStep(page + 1);
      }
    },
    onSwipedRight: () => {
      if (page > 0) {
        handleStep(page - 1);
      }
    },
    trackMouse: true,
  });

  return (
      <Box sx={{ width: "100%", padding: 4 }}>
        <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Story
          </Typography>

          <Stepper
              nonLinear
              activeStep={page}
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{ background: "transparent", padding: 2 }}
          >
            {storySteps.map((step, index) => (
                <Step key={step.label}>
                  <StepButton
                      onClick={() => handleStep(index)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: page === index ? "scale(1.2)" : "scale(1)",
                        transition: "transform 0.3s ease-in-out",
                        color:
                            page === index
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
                      }}
                  >
                    <StepLabel
                        slots={{
                          stepIcon: () => step.icon,
                        }}
                        sx={{
                          "& .MuiStepIcon-root": {
                            marginBottom: 1,
                          },
                        }}
                    >
                      <Typography variant="caption">{step.label}</Typography>
                    </StepLabel>
                  </StepButton>
                </Step>
            ))}
          </Stepper>

          <Box
              {...handlers}
              sx={{
                position: "relative",
                overflow: "hidden",
                minHeight: "400px",
                marginTop: 4,
              }}
          >
            <AnimatePresence initial={false} custom={direction}>
              {/*
              Key must change when 'page' changes so the old one unmounts
              and the new one mounts.
              'custom={direction}' is read by the variants
            */}
              <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                  style={{
                    position: "absolute",
                    width: "100%",
                  }}
              >
                <Paper
                    elevation={4}
                    sx={{
                      padding: 3,
                      borderRadius: 2,
                      background: theme.palette.secondary.dark,
                      minHeight: "400px",
                      display: "flex",
                      alignItems: "center",
                    }}
                >
                  <Box
                      sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                        width: "100%",
                      }}
                  >
                    {storySteps[page].image && (
                        <Box
                            sx={{
                              flex: 1,
                              marginRight: isMobile ? 0 : 2,
                              marginBottom: isMobile ? 2 : 0,
                              position: "relative",
                            }}
                        >
                          {!imageLoaded && (
                              <Box
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                  }}
                              >
                                <CircularProgress color="secondary" />
                              </Box>
                          )}
                          <Box
                              component="img"
                              src={storySteps[page].image}
                              alt={storySteps[page].label}
                              onLoad={() => setImageLoaded(true)}
                              sx={{
                                width: "100%",
                                height: "auto",
                                borderRadius: 2,
                                display: imageLoaded ? "block" : "none",
                              }}
                          />
                        </Box>
                    )}
                    <Box sx={{ flex: 2 }}>
                      <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.primary.light,
                          }}
                      >
                        {storySteps[page].label}
                      </Typography>
                        <Typography
                            variant="h6"
                            sx={{ marginTop: 2 }}
                        >
                          {storySteps[page].longDescription}
                        </Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
  );
};

export default StoryComponent;
