// components/main/rsvpFlow/RsvpPrimaryContactPage.tsx
import React, { useRef } from 'react';
import {Box, Typography} from '@mui/material';
import CustomInputField, { CustomInputFieldRef } from '../../shared/CustomInputField';
import { useFlow } from '../../../context/FlowProvider';
import { Rsvp } from "../../../types/rsvp";
import CustomButton from "../../shared/CustomButton";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface RsvpPrimaryContactPageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpPrimaryContactPage: React.FC<RsvpPrimaryContactPageProps> = ({
                                                                         nextPage,
                                                                         previousPage,
                                                                         requireAnswers,
                                                                       }) => {
  const { formData, setFormData } = useFlow();
  const emailRef = useRef<CustomInputFieldRef>(null);
  const addressRef = useRef<CustomInputFieldRef>(null);
  const phoneRef = useRef<CustomInputFieldRef>(null);

  const primaryOptions = Object.entries(formData.guest_list || {}).map(([key, guest]) => ({
    id: key,
    label: guest.display_name,
  }));

  const handlePrimaryChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      primary_contact: {
        ...formData.primary_contact,
        [field]: value,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      primary_contact: {
        ...formData.primary_contact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleBack = () => {
    previousPage(formData);
  };

  const handleNext = () => {
    const validEmail = emailRef.current?.validate();
    const validAddress = addressRef.current?.validate();
    const validPhone = phoneRef.current?.validate();

    if (formData.primary_contact?.name && validEmail && validAddress && validPhone) {
      nextPage(formData);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  return (
      <Box sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ pt: 0, pb: 1, display: 'flex', justifyContent: 'center' }}>
            <Autocomplete
                options={primaryOptions}
                value={
                  formData.primary_contact?.name && formData.guest_list?.[formData.primary_contact.name]
                      ? {
                        id: formData.primary_contact.name,
                        label: formData.guest_list[formData.primary_contact.name].display_name,
                      }
                      : null
                }
                onChange={(_event, newValue) =>
                    handlePrimaryChange("name", newValue ? newValue.id : "")
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        label={`Primary Contact${formData.primary_contact?.name ? '' : ' is Required'}`}
                        placeholder="Select a primary contact"
                        required
                        error={!formData.primary_contact?.name}
                        sx={{ width: '40ch' }}
                    />
                )}
            />
          </Box>

          <CustomInputField
              ref={emailRef}
              name="email"
              type="email"
              label="Email"
              placeholder="Email"
              value={formData.primary_contact?.email ?? ''}
              onChange={handleChange}
              required={requireAnswers}
          />
          <CustomInputField
              ref={addressRef}
              name="address"
              label="Address"
              placeholder="Address"
              value={formData.primary_contact?.address ?? ''}
              onChange={handleChange}
              required={requireAnswers}
          />
          <CustomInputField
              ref={phoneRef}
              name="phone_number"
              label="Phone Number"
              placeholder="Phone Number"
              value={formData.primary_contact?.phone_number ?? ''}
              onChange={handleChange}
              required={requireAnswers}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', px: 2 }}>
            <CustomButton text="Back" onClick={handleBack} variant="dark" width="75px" />
            <CustomButton text="Next" type="submit" variant="dark" width="75px" />
          </Box>
        </Box>
      </Box>
  );
};

export default RsvpPrimaryContactPage;
