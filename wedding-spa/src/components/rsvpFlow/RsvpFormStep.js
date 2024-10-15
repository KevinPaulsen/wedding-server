import React from "react";
import RsvpInfo, {RSVP_INFO_STEP} from "./RsvpInfo";
import RsvpPrimaryContact, {RSVP_PRIMARY_CONTACT_STEP} from "./RsvpPrimaryContact";
import RsvpGuests, {RSVP_GUESTS_PAGE} from "./RsvpGuests";
import RsvpAddGuest, {RSVP_ADD_GUEST_STEP} from "./RsvpAddGuest";
import RsvpConfirmation, {RSVP_CONFIRMATION_STEP} from "./RsvpConfirmation";

const RSVPFormStep = ({step, changePage, requireAnswers = true, returnPage = null}) => {
    switch (step) {
        case RSVP_INFO_STEP:
            return (
                <div>
                    <h3 className="pb-4"> RSVP Information </h3>
                    <RsvpInfo changePage={changePage}/>
                </div>
            );
        case RSVP_PRIMARY_CONTACT_STEP:
            return (
                <div>
                    <h3 className="pb-4"> Primary Contact </h3>
                    <RsvpPrimaryContact changePage={changePage} requireAnswers={requireAnswers} />
                </div>
            );
        case RSVP_GUESTS_PAGE:
            return (
                <div>
                    <h3 className="pb-4"> Add Guests (including yourself) </h3>
                    <RsvpGuests changePage={changePage} returnPage={returnPage} />
                </div>
            );
        case RSVP_ADD_GUEST_STEP:
            return (
                <div>
                    <h3 className="pb-4"> Add Guest </h3>
                    <RsvpAddGuest changePage={changePage} requireAnswers={requireAnswers} />
                </div>
            );
        case RSVP_CONFIRMATION_STEP:
            return (
                <div>
                    <h3 className="pb-4"> Thank You for RSVP-ing</h3>
                    <RsvpConfirmation/>
                </div>
            );
        default:
            return <div>Unknown Step</div>;
    }
};

export default RSVPFormStep;
