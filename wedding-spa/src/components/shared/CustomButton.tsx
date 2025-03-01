import React, {useState} from 'react';
import {Button, createStyles, makeStyles, Theme} from '@material-ui/core';

interface CustomButtonProps {
    text: string;
    onClick?: () => void;
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
    type?: 'button' | 'submit' | 'reset'; // New prop for button type
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: 'var(--hover-light)',
            color: 'var(--main-dark)',
            textTransform: 'none',
            fontFamily: '"EB Garamond", system-ui',
            fontSize: '16px',
            border: '2px solid var(--main-dark)',
            width: 'auto',
            height: 'auto',
            maxWidth: 'none',
            maxHeight: 'none',
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
    const classes = useStyles();
    const [toggled, setToggled] = useState(false);

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
        if (onClick) {
            onClick();
        }
    };


    return (
        <Button
            type={type}
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
