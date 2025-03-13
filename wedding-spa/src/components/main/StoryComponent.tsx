import React, {useState} from "react";
import {
  Box,
  Button,
  Collapse,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {useSwipeable} from "react-swipeable";

// Import your local images:
import firstMysteryImage from "../../assets/mainCoupleImage.jpeg";

import School from "@mui/icons-material/School";
import Groups from "@mui/icons-material/Groups";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import Lightbulb from "@mui/icons-material/Lightbulb";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

interface StoryStep {
  label: string;
  longDescription: string;
  icon: React.ReactElement;
  image?: string;
}

export const storySteps: StoryStep[] = [
  {
    label: "The Mysterious Meeting",
    longDescription: `
Kevin and Olivia do not recall the precise moment they first crossed paths. They do know they were both students at the University of Washington—Kevin was a wide-eyed freshman, and Olivia was a confident sophomore—and both frequented the Catholic Newman Center. Kevin's first memory was when some upperclassmen jokingly tried to convince Kevin into believing Olivia and a friend named Daphne were sisters. It was a baffling start, to say the least.
    `,
    icon: <School />,
    image: firstMysteryImage,
  },
  {
    label: "A Reunion and a Realization",
    longDescription: `
Fast-forward to 2023: Kevin was working near UW, while Olivia was still immersed in her studies. Their friend groups merged, leading them to go to a mutual friend’s wedding. Kevin, finally getting to know Olivia, found Olivia’s wit and humor thoroughly captivating. Somehow even her lighthearted digs at the Midwest he found enticing. By the time the wedding festivities wrapped up, he was convinced Olivia was an extraordinary blend of charm, beauty, and intelligence.
    `,
    icon: <Groups />,
    image: firstMysteryImage,
  },
  {
    label: "Confessions and Complications",
    longDescription: `
Kevin wore his heart on his sleeve, all but announcing his feelings. Meanwhile, Olivia, serving as a peer minister, casually mentioned she was on a “dating fast” for her peer ministry year. Undeterred, Kevin decided to embark on his own dating fast by joining FOCUS (Fellowship of Catholic University Students). But first, he had to share his growing affection for her. Olivia kept him on pins and needles for an entire week before finally admitting the feelings were mutual.
    `,
    icon: <FavoriteBorder />,
    image: firstMysteryImage,
  },
  {
    label: "A Year (Mostly) Apart",
    longDescription: `
Kevin prepared to head to Baltimore for his FOCUS mission, prompting both to agree it might be “best” to remain friends—at least in theory. That plan quickly unraveled when they found themselves whispering, “I love you,” and deciding to tackle a dating fast together: limiting their weekly calls to a mere hour and a half. It was far from easy, but the experience helped them place God at the center of their relationship and stay focused on the bigger picture.
    `,
    icon: <HourglassEmpty />,
    image: firstMysteryImage,
  },
  {
    label: "The Grand Realization",
    longDescription: `
After enduring a challenging year, Kevin and Olivia both realized their relationship was more than a fleeting romance. Despite telling anyone who would listen that an engagement was nowhere on the horizon, Kevin soon realized there was no sense in waiting. He resolved to propose before returning to Baltimore—a mere three weeks away—kickstarting a whirlwind of planning more ambitious than any FOCUS retreat he had ever attended.
    `,
    icon: <Lightbulb />,
    image: firstMysteryImage,
  },
  {
    label: "The Rooftop Surprise",
    longDescription: `
In that short window, Kevin asked for Olivia’s parents’ and sisters’ blessings, secured the perfect ring, and orchestrated an elaborate plan with her friends. On August 3rd, 2024, he led Olivia to believe he had already left for Baltimore. Meanwhile, her friends guided her to the rooftop of the Graduate Hotel at sunset. Kevin appeared out of nowhere, knelt down, and asked her to marry him. After a playful “maybe,” Olivia offered an enthusiastic “yes!” And just like that, the rest became history.
    `,
    icon: <CheckCircleOutline />,
    image: firstMysteryImage,
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
                      <Typography variant="h6" sx={{ mt: 2 }}>
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
