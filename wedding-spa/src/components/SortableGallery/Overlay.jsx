// Overlay.jsx
export default function Overlay({ photo: { src, alt, srcSet }, width, height, padding, style, ...rest }) {
    return (
            <div style={{ padding, ...style }} {...rest}>
                <img
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        sizes={`${width}px`}
                        srcSet={srcSet?.map((image) => `${image.src} ${image.width}w`).join(", ")}
                />
            </div>
    );
}
