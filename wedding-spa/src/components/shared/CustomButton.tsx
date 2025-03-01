// src/components/CustomButton.tsx
import React, { useState } from 'react';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

interface CustomButtonProps {
    text: string;
    onClick: () => void;
    height?: number | string;
    width?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    variant?: 'light' | 'dark' | 'lightOutlined';
    togglable?: boolean;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // We default to "light" styling
            backgroundColor: 'var(--hover-light)',
            color: 'var(--main-dark)',
            textTransform: 'none',
            fontFamily: '"EB Garamond", system-ui',
            fontSize: '16px',
            border: '2px solid var(--main-dark)',

            // We'll dynamically override these in the component based on props
            width: 'auto',
            height: 'auto',
            maxWidth: 'none',
            maxHeight: 'none',

            // Simple hover style for "light" variant
            '&:hover': {
                backgroundColor: 'var(--hover-light)',
            },
        },
        darkVariant: {
            backgroundColor: 'var(--main-dark)',
            color: 'var(--main-light)',
            border: 'none',

            '&:hover': {
                backgroundColor: 'var(--hover-dark)',
            },
        },
        lightOutlinedVariant: {
            backgroundColor: 'var(--main-light)',
            color: 'var(--main-dark)',
            border: '2px solid var(--main-dark)',
            '&:hover': {
                backgroundColor: 'var(--hover-dark)',
                color: 'var(--main-light)',
            },
        },
        toggled: {
            // If toggled, we’ll go “dark” style by default
            backgroundColor: 'var(--main-dark)',
            color: 'var(--main-light)',
            '&:hover': {
                backgroundColor: 'var(--hover-dark)',
            },
        },
    })
);

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       text,
                                                       onClick,
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
    const classes = useStyles();
    const [toggled, setToggled] = useState(false);

    // Merge all style-like props that can’t easily be handled by makeStyles alone
    const inlineStyles: React.CSSProperties = {
        height: `${height}px`,
        width: width,
        maxHeight: `${maxHeight}px`,
        maxWidth: `${maxWidth}px`,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
    };

    const handleClick = () => {
        if (togglable) {
            setToggled((prev) => !prev);
        }
        onClick();
    };

    return (
        <Button
            variant="contained"
            onClick={handleClick}
            disabled={disabled}
            className={`
        ${classes.root}
        ${variant === 'dark' ? classes.darkVariant : ''}
        ${variant === 'lightOutlined' ? classes.lightOutlinedVariant : ''}
        ${togglable && toggled ? classes.toggled : ''}
      `}
            style={inlineStyles}
        >
            {text}
        </Button>
    );
};

export default CustomButton;
