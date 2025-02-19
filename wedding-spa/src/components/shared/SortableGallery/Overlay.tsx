// Overlay.jsx
import React from "react";

interface ImageProps {
    src: string;
    alt?: string;
    srcSet?: { src: string; width: number }[];
}

interface OverlayProps extends ImageProps {
    width: number;
    height: number;
    padding?: string;
    style?: React.CSSProperties;
    [key: string]: any;
}

const Overlay: React.FC<OverlayProps> = ({ photo: { src, alt, srcSet }, width, height, padding, style, ...rest }) => {
    return (
        <div style={{ padding, ...style }} {...rest}>
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={`${width}px`}
                srcSet={srcSet?.map((image: { src: string; width: number; }) => `${image.src} ${image.width}w`).join(", ")}
            />
        </div>
    );
};

export default Overlay;
