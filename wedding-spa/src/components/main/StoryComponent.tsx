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

import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MoodIcon from '@mui/icons-material/Mood';
import FastForwardIcon from '@mui/icons-material/FastForward';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FavoriteIcon from '@mui/icons-material/Favorite';


interface StoryStep {
  label: string;
  longDescription: string;
  icon: React.ReactElement;
  image?: string;
}

const storySteps: StoryStep[] = [
  {
    label: "In the Beginning...",
    longDescription: "Kevin and Olivia both attended the University of Washington and were active members of the Newman Center. Oddly enough, neither one can recall the exact moment they first met. Kevin was a freshman in 2020, while Olivia was a year ahead of him—and each had their own circle of friends. Kevin’s first memory happened at a Chipotle: a group of mischievous upperclassmen (led by Olivia) tried to convince Kevin that Olivia and another student, Daphne, were sisters. Of course, they weren't. From that day on, Kevin knew who Olivia was, but they remained distant acquaintances throughout their time on campus.\n",
    icon: <SchoolIcon />,
    image: firstMysteryImage,
  },
  {
    label: "The Meet Cute",
    longDescription: "Fast-forward to 2022. Kevin was working but still in the UW neighborhood, and Olivia had become a Peer Minister at the Newman Center. Many of Kevin’s close friends also served in peer ministry that year, finally causing their social circles to crash into one another. A trip to a mutual friend’s wedding in St. Louis sealed the deal. Five of them stayed in an Airbnb for a few days, and Kevin and Olivia went from virtual strangers to new friends in record time.\n",
    icon: <GroupAddIcon />,
    image: firstMysteryImage,
  },
  {
    label: "Midwest Shade & Sparks",
    longDescription: "During that wedding trip, Kevin quickly became smitten by Olivia’s beauty, her sarcastic sense of humor, and her inexplicably fierce pride for Washington State. Her endless comments about the Midwest—often tinged with witty skepticism about corn and flatness—left Kevin oddly charmed. He soon found himself finding every excuse to be around her once they returned to Seattle, even though it was painfully obvious (to literally everyone) that he was falling hard.\n",
    icon: <MoodIcon />,
    image: firstMysteryImage,
  },
  {
    label: "Fast and FOCUSed",
    longDescription: "Shortly after, Kevin discovered that Olivia was on a “dating fast” as part of her peer ministry. She made this crystal clear during a small-group retreat when she casually announced it in front of Kevin and the rest of the group. Disheartened, Kevin stubbornly decided to join FOCUS (the Fellowship of Catholic University Students) which requires a dating fast of his own. He likes to joke that was the “real” reason he applied, but the truth is he felt called to serve. Regardless, both of them stuck to their fasts...for a while.\n",
    icon: <FastForwardIcon />,
    image: firstMysteryImage,
  },
  {
    label: "Confession & Chaos",
    longDescription: "As the months went by, Kevin couldn’t keep his feelings hidden. Before leaving for his FOCUS assignment in Baltimore, he confessed his affection during a walk. Olivia took a whole week to gather her thoughts before finally working up the nerve to admit that she had feelings for him too. Kevin described this as a time of being “happy-sad”: thrilled that their feelings matched, but heartbroken at the idea of leaving so soon. They agreed not to start dating mere weeks before Kevin moved—but that resolve lasted all of ten days before they caved, realizing long distance would be easier than remaining “just friends.”\n",
    icon: <HourglassEmptyIcon />,
    image: firstMysteryImage,
  },
  {
    label: "Love Across Zip Codes",
    longDescription: "So, they dated…with a catch. Their dating fast led them to limit communication to just an hour and a half each week with no texting. That year was tough—Kevin in Baltimore, Olivia back in Seattle—but it gave them a chance to center their budding relationship on Christ and discern marriage seriously. As Kevin always says, “You don’t do a dating fast with someone if you’re not absolutely serious about them!” Their relationship grew strong in its commitment and faith, and by the end of Kevin’s first year with FOCUS, they both knew where this was headed.",
    icon: <FlightTakeoffIcon />,
    image: firstMysteryImage,
  },
  {
    label: "The ‘Maybe’ Proposal",
    longDescription: "When Kevin returned home for the summer, he quickly realized Olivia was the woman he was going to marry, and there was no point in waiting. He asked Olivia’s parents and sisters for their blessing and schemed the perfect plan. On August 3, 2024, Olivia’s friends took her to the rooftop of the Graduate Hotel (where Kevin and Olivia had many dates and impactful moments) at sunset. Olivia was under the impression that Kevin was already on his way back to Baltimore. Suddenly, he appeared behind her, dropped to one knee, and asked if she would make him the happiest man alive. Caught off guard, Olivia, nervous and excited, replied “Maybe!” Kevin finished his sentence—“…and do me the great honor of being my wife?”—and she immediately said, “Yes!” They walked away from that rooftop with a ring and the unshakable certainty that their forever had just begun.",
    icon: <FavoriteIcon />,
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
