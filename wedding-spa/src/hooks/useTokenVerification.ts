import { useEffect, useState } from 'react';
import { verifyToken } from "../services/ApiService";

const useTokenVerification = (authToken: string | null): boolean | null => {
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (!authToken) {
                setIsValidToken(false);
                return;
            }
            try {
                const isValid = await verifyToken(authToken);
                setIsValidToken(isValid === true);
            } catch (err) {
                setIsValidToken(false);
            }
        };

        checkTokenValidity();
    }, [authToken]);

    return isValidToken;
};

export default useTokenVerification;
