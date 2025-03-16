// pages/rsvp/RSVPStepLayout.tsx
import React, {JSX} from 'react';
import {Box, Button, Typography} from '@mui/material';

export interface StepLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextText?: string | JSX.Element;
  nextDisabled?: boolean;
}

const StepLayout: React.FC<StepLayoutProps> = ({
                                                 title,
                                                 description,
                                                 children,
                                                 onBack = null,
                                                 onNext = null,
                                                 onSubmit = null,
                                                 nextText = 'next',
                                                 nextDisabled = false,
                                               }) => {
  return (
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" sx={{textAlign: 'center'}}>
          {title}
        </Typography>

        {description && (
            <Typography variant="body1" sx={{textAlign: 'center', mb: 2}}>
              {description}
            </Typography>
        )}

        <Box component={onSubmit ? 'form' : 'div'} onSubmit={onSubmit ? onSubmit: () => {}} textAlign="center"
             width="100%">
          {children}

          {(onNext || onSubmit) && <Box mt={2} display="flex" justifyContent={onBack ? 'space-between' : 'center'}>
            {onBack &&
                <Button variant="outlined" onClick={onBack}>
                  Back
                </Button>
            }
            {onNext === null ?
                <Button type="submit" variant="contained" disabled={nextDisabled}>
                  {nextText}
                </Button>
                :
                <Button variant="contained" onClick={onNext} disabled={nextDisabled}>
                  {nextText}
                </Button>
            }
          </Box>}
        </Box>
      </Box>
  );
}

export default StepLayout;
