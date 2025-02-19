// timelineData.js
import adoration from "../../../assets/icons/Adoration.png";
import ceremony from "../../../assets/icons/Cerimony.png";
import cocktail from "../../../assets/icons/Cocktail.png";
import food from "../../../assets/icons/Food.png";
import party from "../../../assets/icons/Party.png";
import tea from "../../../assets/icons/Tea.png";

export interface TimelineEvent {
    time: string;
    title: string;
    location?: string;
    image: string;
}

export const timelineEvents: TimelineEvent[] = [
    {
        time: "10:00 AM",
        title: "Ceremony",
        location: "Blessed Sacrament",
        image: ceremony,
    },
    {
        time: "11:00 AM",
        title: "Holy Hour",
        location: "Newman Center",
        image: adoration,
    },
    {
        time: "5:00 PM",
        title: "Cocktail Hour",
        location: "Pickering Barn",
        image: cocktail,
    },
    {
        time: "6:00 PM",
        title: "Dinner",
        location: "Pickering Barn",
        image: food,
    },
    {
        time: "7:30 PM",
        title: "PARTY!",
        location: "Dance Floor",
        image: party,
    },
    {
        time: "9:00 PM",
        title: "Chai Bar",
        image: tea,
    },
    {
        time: "10:30 PM",
        title: "Send Off",
        image: tea,
    },
];
