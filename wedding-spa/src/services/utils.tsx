// utils.tsx

export const getImageDimensions = (
    file: File
): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
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
