// components/shared/CustomInputField.tsx
import React, {ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle, useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';

export interface CustomInputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
  min?: number | string;
  padding?: object;
  width?: string;
}

export interface CustomInputFieldRef {
  validate: () => boolean;
}

const CustomInputField = forwardRef(
    (
        {
          label,
          type = 'text',
          placeholder,
          value,
          onChange,
          required = true,
          name,
          padding = {pt: 0, pb: 1},
          width = '40ch',
        }: CustomInputFieldProps,
        ref: ForwardedRef<CustomInputFieldRef>
    ) => {
      const theme = useTheme();
      const [hasError, setHasError] = useState<boolean>(false);

      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        if (hasError && e.target.value.toString().trim() !== '') {
          setHasError(false);
        }
      };

      const handleBlur = () => {
        if (required && (!value || value.toString().trim() === '')) {
          setHasError(true);
        }
      };

      useImperativeHandle(ref, () => ({
        validate: () => {
          if (required && (!value || value.toString().trim() === '')) {
            setHasError(true);
            return false;
          }
          return true;
        },
      }));

      return (
          <Box
              sx={{
                ...padding,
                display: 'flex',
                justifyContent: 'center',
              }}
          >
            <TextField
                name={name}
                type={type}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                error={hasError}
                variant="outlined"
                label={label && label + (hasError ? " is Required" : "")}
                size="small"
                sx={{width}}
            />
          </Box>
      );
    }
);

CustomInputField.displayName = "CustomInputField";

export default CustomInputField;
