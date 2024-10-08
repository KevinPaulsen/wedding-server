import { useEffect, useState } from 'react';
import {API_URL} from "../config";

const useTokenVerification = (authToken) => {
    const [isValidToken, setIsValidToken] = useState(null);

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (!authToken) {
                setIsValidToken(false);
                return;
            }

            try {
                // Verify token with the server
                const response = await fetch(`${API_URL}/auth/verify-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                setIsValidToken(false);
            }
        };

        checkTokenValidity();
    }, [authToken]);

    return isValidToken;
};

export default useTokenVerification;