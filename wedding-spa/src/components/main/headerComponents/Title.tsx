// Title.tsx
import React from 'react';
import '../../../styles/Header.css';
import { Link } from 'react-router-dom';

interface TitleProps {
    color?: string;
    link?: boolean;
}

const Title: React.FC<TitleProps> = ({ color, link = true }) => {
    return link ? (
        <Link to="/wedding-spa/public" style={{ textDecoration: 'none' }}>
            <h1 className="title" style={{ color }}>{'Kevin & Olivia'}</h1>
        </Link>
    ) : (
        <h1 className="title" style={{ color }}>{'Kevin & Olivia'}</h1>
    );
};

export default Title;
