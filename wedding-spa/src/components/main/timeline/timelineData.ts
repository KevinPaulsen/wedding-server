// components/main/timeline/timelineData.ts
import adoration from "../../../assets/icons/Adoration.png";
import ceremony from "../../../assets/icons/Cerimony.png";
import cocktail from "../../../assets/icons/Cocktail.png";
import food from "../../../assets/icons/Food.png";
import party from "../../../assets/icons/Party.png";
import tea from "../../../assets/icons/Tea.png";
import sendoff from "../../../assets/icons/Sendoff.png";

export interface TimelineEvent {
  time: string;
  title: string;
  location?: string;
  address?: string;
  image: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    time: "12:30 PM",
    title: "CEREMONY",
    location: "BLESSED SACRAMENT",
    address: "5050 8th Ave NE\nSeattle, WA 98105",
    image: ceremony,
  },
  {
    time: "3:00 PM",
    title: "HOLY HOUR",
    location: "NEWMAN CENTER",
    address: "4502 20th Ave NE\nSeattle, WA 98105",
    image: adoration,
  },
  {
    time: "5:30 PM",
    title: "COCKTAIL HOUR",
    location: "PICKERING BARN",
    address: "1730 10th Ave NW\nIssaquah, WA 98027",
    image: cocktail,
  },
  {
    time: "6:30 PM",
    title: "DINNER",
    location: "PICKERING BARN",
    image: food,
  },
  {
    time: "8:00 PM",
    title: "PARTY!",
    image: party,
  },
  {
    time: "9:00 PM",
    title: "CHAI BAR",
    image: tea,
  },
  {
    time: "10:30 PM",
    title: "SEND OFF",
    image: sendoff,
  },
];
