// src/types/gallery.ts

/**
 * Matches your Java ImageMetadata class fields.
 * Adjust nullable fields if needed.
 */
export interface ImageMetadata {
    imageId: string;
    orderValue?: number | null;
    imageUrl?: string;
    width?: number;
    height?: number;
    uploadTimestamp?: number;
    // partition?: string; // The server sets this to "PHOTO" but you may not need to store it in TS
}
