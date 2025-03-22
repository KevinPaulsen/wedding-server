// components/main/ourStory/StoryComponent.tsx
import React, {useState} from "react";
import {Box, useMediaQuery, useTheme,} from "@mui/material";

// Import your local images:
import firstMysteryImage from "../../../assets/mainCoupleImage.jpeg";

import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MoodIcon from '@mui/icons-material/Mood';
import FastForwardIcon from '@mui/icons-material/FastForward';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DesktopStoryStepper from "./DesktopStoryStepper";
import MobileStoryStepper from "./MobileStoryStepper";


interface StoryStep {
  label: string;
  longDescription: string;
  icon: React.ReactElement;
  image?: string;
}

export interface StoryProps {
  page: number;
  handleStep: (step: number) => void;
  storySteps: StoryStep[]
}

const storySteps: StoryStep[] = [
  {
    label: "In the Beginning...",
    longDescription: "Kevin and Olivia both attended the University of Washington and were active members of the Newman Center. Oddly enough, neither one can recall the exact moment they first met. Kevin was a freshman in 2020, while Olivia was a year ahead of him—and each had their own circle of friends. Kevin’s first memory happened at a Chipotle: a group of mischievous upperclassmen (led by Olivia) tried to convince Kevin that Olivia and another student were sisters. Of course, they weren't. From that day on, Kevin knew who Olivia was, but they remained distant acquaintances throughout their time on campus.\n",
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
    longDescription: "During that wedding trip, Kevin quickly became smitten by Olivia’s beauty, her sarcastic sense of humor, and her inexplicably fierce pride for Washington State. Her endless comments about the Midwest—often tinged with witty skepticism about corn and flatness—left Kevin oddly charmed. He soon found himself finding every excuse to be around her once they returned to Seattle, and it was painfully obvious (to literally everyone) that he was falling hard.\n",
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

  return (
      <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          {!isMobile ?
              <DesktopStoryStepper
                  page={page}
                  handleStep={handleStep}
                  storySteps={storySteps}
              /> :
              <MobileStoryStepper
                  page={page}
                  handleStep={handleStep}
                  storySteps={storySteps}
              />
          }
        </Box>
      </Box>
  );
};

export default StoryComponent;
