// components/shared/SortableGallery/Overlay.tsx
import React from "react";

interface Photo {
    src: string;
    alt?: string;
    srcSet?: Array<{ src: string; width: number }>;
}

interface OverlayProps {
    photo: Photo;
    width: number;
    height: number;
    padding?: string;
    style?: React.CSSProperties;
    className?: string;
}

const Overlay: React.FC<OverlayProps> = ({
                                             photo: { src, alt, srcSet },
                                             width,
                                             height,
                                             padding,
                                             style,
                                             className,
                                         }) => {
    return (
        <div style={{ padding, ...style }} className={className}>
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={`${width}px`}
                srcSet={srcSet
                    ?.map((image) => `${image.src} ${image.width}w`)
                    .join(", ")}
            />
        </div>
    );
};

export default Overlay;
