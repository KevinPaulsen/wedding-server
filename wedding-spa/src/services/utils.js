// utils.js
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Once loaded, resolve with the image dimensions
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            // Clean up the object URL after usage
            URL.revokeObjectURL(img.src);
        };
        img.onerror = (error) => {
            URL.revokeObjectURL(img.src);
            reject(error);
        };
        // Create an object URL for the file
        img.src = URL.createObjectURL(file);
    });
};
