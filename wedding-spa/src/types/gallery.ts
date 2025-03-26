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
