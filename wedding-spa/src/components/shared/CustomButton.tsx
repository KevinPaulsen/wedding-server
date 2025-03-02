// CustomButton.tsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export type ButtonVariant = 'light' | 'dark' | 'lightOutlined';

interface CustomButtonProps {
    text: string;
    onClick?: () => void;
    height?: number | string;
    width?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    variant?: ButtonVariant;
    togglable?: boolean;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

interface StyledButtonProps {
    variantType?: ButtonVariant;
    togglable?: boolean;
    toggled?: boolean;
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'variantType' && prop !== 'togglable' && prop !== 'toggled',
})<StyledButtonProps>(({ theme, variantType, togglable, toggled }) => {
    // If the button is togglable and is in a toggled state, we use the dark variant styles.
    const appliedVariant = togglable && toggled ? 'dark' : variantType || 'light';
    switch (appliedVariant) {
        case 'dark':
            return {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: 'none',
                textTransform: 'none',
                fontFamily: theme.typography.fontFamily,
                fontSize: '16px',
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                },
            };
        case 'lightOutlined':
            return {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.secondary.contrastText,
                border: `2px solid ${theme.palette.secondary.contrastText}`,
                textTransform: 'none',
                fontFamily: theme.typography.fontFamily,
                fontSize: '16px',
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                },
            };
        case 'light':
        default:
            return {
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.secondary.contrastText,
                border: `2px solid ${theme.palette.secondary.contrastText}`,
                textTransform: 'none',
                fontFamily: theme.typography.fontFamily,
                fontSize: '16px',
                '&:hover': {
                    backgroundColor: theme.palette.secondary.light,
                },
            };
    }
});

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       text,
                                                       onClick,
                                                       type = 'button',
                                                       height = 40,
                                                       width = '100%',
                                                       maxHeight = 80,
                                                       maxWidth = 300,
                                                       variant = 'light',
                                                       togglable = false,
                                                       marginTop = 0,
                                                       marginRight = 0,
                                                       marginBottom = 0,
                                                       marginLeft = 0,
                                                       disabled = false,
                                                   }) => {
    const [toggled, setToggled] = useState(false);

    const handleClick = () => {
        if (togglable) {
            setToggled((prev) => !prev);
        }
        if (onClick) {
            onClick();
        }
    };

    return (
        <StyledButton
            variantType={variant}
            togglable={togglable}
            toggled={toggled}
            onClick={handleClick}
            disabled={disabled}
            type={type}
            // Use the sx prop so sizes and margins come from theme.spacing when possible.
            sx={{
                height: `${height}px`,
                width: width,
                maxHeight: `${maxHeight}px`,
                maxWidth: `${maxWidth}px`,
                mt: marginTop,
                mr: marginRight,
                mb: marginBottom,
                ml: marginLeft,
            }}
        >
            {text}
        </StyledButton>
    );
};

export default CustomButton;
