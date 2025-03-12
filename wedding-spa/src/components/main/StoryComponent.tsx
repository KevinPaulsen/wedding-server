import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import { useSwipeable } from "react-swipeable";
import SchoolIcon from "@mui/icons-material/School";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// Import your local images:
import firstMysteryImage from "../../assets/mainCoupleImage.jpeg";
import weddingSparkImage from "../../assets/mainCoupleImage.jpeg";
import fastFocusedImage from "../../assets/mainCoupleImage.jpeg";
import noDateDilemmaImage from "../../assets/mainCoupleImage.jpeg";
import rooftopSurpriseImage from "../../assets/mainCoupleImage.jpeg";

interface StoryStep {
  label: string;
  longDescription: string;
  icon: React.ReactElement;
  image?: string;
}

export const storySteps: StoryStep[] = [
  {
    label: "The First Mystery",
    longDescription:
        "Kevin’s earliest memory is of Olivia and some upperclassmen convincing him she and Daphne were sisters. We still have no proof they aren’t. Regardless, it set the stage for everything that followed.",
    icon: <SchoolIcon fontSize="large" />,
    image: firstMysteryImage,
  },
  {
    label: "Wedding Spark",
    longDescription:
        "At a mutual friend’s wedding, Kevin discovered Olivia's unique charm—her hilarious hot takes (especially her humorous disdain for the Midwest) instantly captivated him.",
    icon: <CelebrationIcon fontSize="large" />,
    image: weddingSparkImage,
  },
  {
    label: "Fast & Focused",
    longDescription:
        "Inspired by Olivia’s commitment, Kevin decided to start his own dating fast by joining FOCUS. But just before leaving for training, he confessed his feelings. Olivia kept him in suspense for a whole week before admitting she liked him back.",
    icon: <HourglassEmptyIcon fontSize="large" />,
    image: fastFocusedImage,
  },
  {
    label: "No-Date Dilemma",
    longDescription:
        "Despite promising to wait until Kevin returned from his mission, the magnetic pull between us made silence unbearable. We quickly acknowledged our love, even if it meant surviving a year-long conversation limit of 1.5 hours per week!",
    icon: <PeopleIcon fontSize="large" />,
    image: noDateDilemmaImage,
  },
  {
    label: "Rooftop Surprise",
    longDescription:
        "Kevin orchestrated a breathtaking proposal on the rooftop of the Graduate Hotel. With Olivia expecting him to have left for Baltimore, the surprise unfolded against a stunning sunset. After a playful 'maybe,' her enthusiastic 'yes' sealed our forever.",
    icon: <EmojiEventsIcon fontSize="large" />,
    image: rooftopSurpriseImage,
  },
];

const StoryComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);

  const handleStep = (nextStep: number) => {
    if (nextStep === page) return;
    setPage(nextStep);
  };

  // Swipe handlers
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
    delta: 50,
  });

  return (
      <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Typography variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
            Our Story
          </Typography>

          {/* ---------------- DESKTOP (HORIZONTAL STEPPER) ---------------- */}
          {!isMobile ? (
              <Stepper
                  nonLinear
                  activeStep={page}
                  alternativeLabel
                  orientation="horizontal"
                  sx={{ background: "transparent", p: 2 }}
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
                                    ? theme.palette.primary.light
                                    : theme.palette.primary.main,
                          }}
                      >
                        <StepLabel
                            slots={{ stepIcon: () => step.icon }}
                            sx={{ "& .MuiStepIcon-root": { mb: 1 } }}
                        >
                          <Typography
                              variant="caption"
                              sx={{
                                color:
                                    page === index
                                        ? theme.palette.primary.light
                                        : theme.palette.primary.main,
                              }}
                          >
                            {step.label}
                          </Typography>
                        </StepLabel>
                      </StepButton>
                    </Step>
                ))}
              </Stepper>
          ) : (
              /* ---------------- MOBILE (VERTICAL STEPPER) with Collapse ---------------- */
              <Stepper orientation="vertical" nonLinear sx={{ p: 2 }}>
                {storySteps.map((step, index) => {
                  const isActive = page === index;
                  return (
                      <Step key={step.label}>
                        <StepButton
                            onClick={() => handleStep(index)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              transform: isActive ? "scale(1.05)" : "scale(1)",
                              transition: "transform 0.3s ease-in-out",
                              color: isActive
                                  ? theme.palette.primary.light
                                  : theme.palette.primary.main,
                            }}
                        >
                          <StepLabel
                              slots={{ stepIcon: () => step.icon }}
                              sx={{
                                "& .MuiStepIcon-root": { mr: 1 },
                              }}
                          >
                            <Typography
                                variant="caption"
                                sx={{
                                  color: isActive
                                      ? theme.palette.primary.light
                                      : theme.palette.primary.main,
                                }}
                            >
                              {step.label}
                            </Typography>
                          </StepLabel>
                        </StepButton>

                        {/* The key to smooth open/close is to ensure the final height
                      is predictable, especially around images. */}
                        <Collapse in={isActive} timeout="auto" unmountOnExit>
                          <Box {...handlers} sx={{ position: "relative", mt: 2 }}>
                            <Paper
                                elevation={4}
                                sx={{
                                  p: 3,
                                  borderRadius: 2,
                                  background: theme.palette.secondary.dark,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  overflow: "hidden",
                                }}
                            >
                              <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                              >
                                {step.image && (
                                    // Aspect-ratio box to avoid reflow as the image loads
                                    <Box
                                        sx={{
                                          position: "relative",
                                          width: "100%",
                                          overflow: "hidden",
                                          borderRadius: 2,
                                          // 16:9 ratio reserved
                                          pt: "56.25%",
                                          mb: 2,
                                        }}
                                    >
                                      <Box
                                          component="img"
                                          src={step.image}
                                          alt={step.label}
                                          loading="lazy"
                                          sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                          }}
                                      />
                                    </Box>
                                )}
                                <Box sx={{ textAlign: "center" }}>
                                  <Typography
                                      variant="h6"
                                      gutterBottom
                                      sx={{
                                        fontWeight: 500,
                                        color: theme.palette.primary.light,
                                      }}
                                  >
                                    {step.label}
                                  </Typography>
                                  <Typography variant="body1" sx={{ mt: 2 }}>
                                    {step.longDescription}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Same navigation buttons as on desktop */}
                              <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    mt: 3,
                                  }}
                              >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={page === 0}
                                    onClick={() => handleStep(page - 1)}
                                >
                                  Previous
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={page === storySteps.length - 1}
                                    onClick={() => handleStep(page + 1)}
                                >
                                  Next
                                </Button>
                              </Box>
                            </Paper>
                          </Box>
                        </Collapse>
                      </Step>
                  );
                })}
              </Stepper>
          )}

          {/* ---------------- DESKTOP CARD BELOW ---------------- */}
          {!isMobile && (
              <Box {...handlers} sx={{ position: "relative", mt: 4 }}>
                <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: theme.palette.secondary.dark,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                >
                  <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                      }}
                  >
                    {storySteps[page].image && (
                        <Box
                            sx={{
                              flex: 1,
                              mr: 2,
                              position: "relative",
                              overflow: "hidden",
                              borderRadius: 2,
                            }}
                        >
                          <Box
                              component="img"
                              src={storySteps[page].image}
                              alt={storySteps[page].label}
                              loading="lazy"
                              sx={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: 2,
                              }}
                          />
                        </Box>
                    )}
                    <Box sx={{ flex: 2, textAlign: "center" }}>
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
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        {storySteps[page].longDescription}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        mt: 3,
                      }}
                  >
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={page === 0}
                        onClick={() => handleStep(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={page === storySteps.length - 1}
                        onClick={() => handleStep(page + 1)}
                    >
                      Next
                    </Button>
                  </Box>
                </Paper>
              </Box>
          )}
        </Box>
      </Box>
  );
};

export default StoryComponent;
