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
  useTheme
} from "@mui/material";
import {StoryProps} from "./StoryComponent";
import React from "react";

// Mobile version: vertical stepper with collapse animation
const MobileStoryStepper: React.FC<StoryProps> = ({ page, handleStep, storySteps }) => {
  const theme = useTheme();
  return (
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
                      sx={{ "& .MuiStepIcon-root": { mr: 1 } }}
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
                <Collapse in={isActive} timeout="auto" unmountOnExit>
                  <Box sx={{ position: "relative", mt: 2 }}>
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
                            <Box
                                sx={{
                                  position: "relative",
                                  width: "100%",
                                  overflow: "hidden",
                                  borderRadius: 2,
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
  );
};

export default MobileStoryStepper;
