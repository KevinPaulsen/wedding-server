// types/gallery.ts

/**
 * Represents the raw image metadata from the backend API.
 */
export interface ImageMetadata {
  imageId: string;
  orderValue?: number | null;
  imageUrl?: string;
  width?: number;
  height?: number;
  // Add additional fields if necessary.
}

/**
 * Represents a photo in the client-side gallery.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  imageId: string;
  key?: string;
  srcSet?: Array<{ src: string; width: number }>;
}
