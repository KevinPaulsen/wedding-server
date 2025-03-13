import {
  Box,
  Button,
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

// Desktop version: horizontal stepper
const DesktopStoryStepper: React.FC<StoryProps> = ({ page, handleStep, storySteps }) => {
  const theme = useTheme();
  return (
      <>
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
        <Box sx={{ position: "relative", mt: 4 }}>
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
                  minHeight: "360px",
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
                <Typography variant="body1" sx={{ mt: 2, fontSize: 20 }}>
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
      </>
  );
};

export default DesktopStoryStepper;