// useGetPhotoMetadata.ts
import { useEffect, useState } from 'react';
import { useApi } from '../useApi';
import { getPhotoMetadata } from "../../services/ApiService";
import { ImageMetadata as BackendImageMetadata } from '../../types/gallery';

export interface PhotoMetadata {
    src: string;
    width: number;
    height: number;
    imageId: string;
}

export function useGetPhotoMetadata() {
    // Call the API with no arguments: A = [].
    const { data, error, loading, execute } = useApi<BackendImageMetadata[], []>(getPhotoMetadata);
    const [photos, setPhotos] = useState<PhotoMetadata[]>([]);

    useEffect(() => {
        execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data) {
            const transformed = data.map(item => ({
                src: item.imageUrl ?? '',
                width: item.width ?? 800,
                height: item.height ?? 600,
                imageId: item.imageId,
            }));
            setPhotos(transformed);
        }
    }, [data]);

    return { data: photos, setData: setPhotos, loading, error };
}

export default useGetPhotoMetadata;
