import { useEffect, useState } from 'react';
import { getPhotoMetadata } from "../services/ApiService";

export interface PhotoMetadata {
    src: string;
    width: number;
    height: number;
    imageId: string;
}

const useGetPhotoMetadata = () => {
    const [data, setData] = useState<PhotoMetadata[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPhotoMetadata = async () => {
            try {
                const metadata = await getPhotoMetadata();
                if (isMounted) {
                    const photos: PhotoMetadata[] = metadata.map((item: any) => ({
                        src: item.imageUrl,
                        width: item.width,
                        height: item.height,
                        imageId: item.imageId,
                    }));
                    setData(photos);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotoMetadata();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, setData, loading, error };
};

export default useGetPhotoMetadata;
