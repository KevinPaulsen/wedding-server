// components/main/rsvpFlow/RSVPStepLayout.tsx
import React, {JSX} from 'react';
import {Box, Typography} from '@mui/material';
import CustomButton from "../../shared/CustomButton";

export interface StepLayoutProps {
  title: string;
  header?: string;
  description?: string | JSX.Element;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextText?: string | JSX.Element;
  nextDisabled?: boolean;
}

const StepLayout: React.FC<StepLayoutProps> = ({
                                                 title,
                                                 header,
                                                 description,
                                                 children,
                                                 onBack = null,
                                                 onNext = null,
                                                 onSubmit = null,
                                                 nextText = 'Next',
                                                 nextDisabled = false,
                                               }) => {
  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
      >

        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        {header && <Typography variant="h6">
          {header}
        </Typography>}


        {description && (
            <Typography variant="body1" sx={{ mb: 2, maxWidth: "500px"}}>
              {description}
            </Typography>
        )}

        <Box
            component={onSubmit ? 'form' : 'div'}
            onSubmit={onSubmit ? onSubmit: () => {}}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
        >
          {children}

          {(onNext || onSubmit) && <Box mt={2} display="flex" justifyContent={onBack ? 'space-between' : 'center'} width='100%'>
            {onBack &&
                <CustomButton text="Back" onClick={onBack} variant="dark" width='auto' />
            }
            {onNext === null ?
                <CustomButton text={nextText} type="submit" variant="dark" width='auto' />
                :
                <CustomButton text={nextText} onClick={onNext} disabled={nextDisabled} variant="dark" width='auto' />
            }
          </Box>}
        </Box>
      </Box>
  );
}

export default StepLayout;
