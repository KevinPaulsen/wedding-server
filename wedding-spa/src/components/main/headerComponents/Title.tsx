// components/main/headerComponents/Title.tsx
import React from 'react';
import '../../../styles/Header.css';
import {Link} from 'react-router-dom';
import {Typography} from "@mui/material";

interface TitleProps {
    color?: string;
    link?: boolean;
}

const Title: React.FC<TitleProps> = ({ color, link = true }) => {
    return link ? (
        <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography variant="h1" color={color} sx={{ fontSize: 'clamp(1em, 4vw + 1em, 6em)' }}>
                Kevin & Olivia
            </Typography>
        </Link>
    ) : (
        <h1 className="title" style={{ color }}>{'Kevin & Olivia'}</h1>
    );
};

export default Title;
