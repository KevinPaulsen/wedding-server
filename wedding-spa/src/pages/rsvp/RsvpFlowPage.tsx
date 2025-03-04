// src/pages/rsvp/RsvpFlowPage.tsx
import React, {useState} from 'react';
import Container from '@mui/material/Container';
import {CSSTransition} from 'react-transition-group';

import Title from '../../components/main/headerComponents/Title';
import CancelButton from '../../components/shared/rsvpFlow/CancelButton';
import RSVPFormStep, {
    RSVP_CEREMONY_PAGE,
    RSVP_CONFIRMATION_PAGE,
    RSVP_RECEPTION_PAGE,
    RSVP_REHEARSAL_PAGE,
    RSVP_ROCE_PAGE,
    RSVP_VERIFICATION_PAGE
} from '../../components/shared/rsvpFlow/RsvpFormStep';

import {Rsvp} from '../../types/rsvp';
import '../../styles/RsvpFlow.css';
import {Grid2} from "@mui/material";

function allowedPage(rsvp: Rsvp, nextStep: number) {
    switch (nextStep) {
        case RSVP_ROCE_PAGE:
            return rsvp.roce.invited;
        case RSVP_REHEARSAL_PAGE:
            return rsvp.rehearsal.invited;
        case RSVP_CEREMONY_PAGE:
            return rsvp.ceremony.invited;
        case RSVP_RECEPTION_PAGE:
            return rsvp.reception.invited;
        default:
            return true;
    }
}

const RsvpFlowPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(RSVP_VERIFICATION_PAGE);
    const [displayedStep, setDisplayedStep] = useState<number>(RSVP_VERIFICATION_PAGE);
    const [inProp, setInProp] = useState<boolean>(true);

    const nextPage = (rsvp: Rsvp): void => {
        if (inProp) {
            setInProp(false);

            let nextStep = currentStep + 1;
            while (!allowedPage(rsvp, nextStep)) {
                nextStep += 1;
            }
            setCurrentStep(nextStep);
        }
    };

    const previousPage = (rsvp: Rsvp): void => {
        if (inProp) {
            setInProp(false);

            let nextStep = currentStep - 1;
            while (!allowedPage(rsvp, nextStep)) {
                nextStep -= 1;
            }
            setCurrentStep(nextStep);
        }
    };

    const onExited = (): void => {
        setDisplayedStep(currentStep);
        setInProp(true);
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'var(--main-light)',
            }}
        >
            <Grid2
                container
                sx={{
                    mt: 5,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Grid2 sx={{ flexBasis: '100%' }}>
                    <Title link={false} color="default" />
                </Grid2>
            </Grid2>

            <Grid2
                container
                sx={{
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Grid2 sx={{ flexBasis: '100%' }}>
                    <CSSTransition
                        in={inProp}
                        timeout={200}
                        classNames="fade"
                        onExited={onExited}
                        unmountOnExit
                    >
                        <RSVPFormStep
                            step={displayedStep}
                            nextPage={nextPage}
                            previousPage={previousPage}
                        />
                    </CSSTransition>
                </Grid2>
            </Grid2>

            <Grid2
                container
                sx={{
                    height: '75px',
                    pb: 3,
                    pt: 2,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {currentStep !== RSVP_CONFIRMATION_PAGE && (
                    <Grid2>
                        <CancelButton route="/" />
                    </Grid2>
                )}
            </Grid2>
        </Container>
    );
};

export default RsvpFlowPage;
