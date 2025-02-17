// useGetPhotoMetadata.js
import {useEffect, useState} from 'react';
import {getPhotoMetadata} from "../services/ApiService";

const useGetPhotoMetadata = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPhotoMetadata = async () => {
            try {
                const metadata = await getPhotoMetadata();

                if (isMounted) {
                    setData(metadata.map(item => ({
                        src: item.imageUrl,
                        width: item.width,
                        height: item.height,
                        imageId: item.imageId,
                    })));
                }
            } catch (err) {
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

    return {data, setData, loading, error};
};

export default useGetPhotoMetadata;
