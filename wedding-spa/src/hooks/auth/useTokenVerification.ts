// hooks/auth/useTokenVerification.ts
import {useEffect} from 'react';
import {useApi} from '../useApi'; // adjust the path as needed
import {verifyToken} from "../../services/ApiService";

/**
 * This hook uses the generic useApi hook to verify a token.
 * When an authToken is present, it automatically calls execute(authToken).
 * It returns an object with isValid (boolean | null), loading, and error.
 */
const useTokenVerification = (authToken: string | null) => {
  // useApi is parameterized with T = boolean and argument type [string]
  const {data, error, loading, execute} = useApi<boolean, [string]>(verifyToken);

  useEffect(() => {
    if (authToken) {
      execute(authToken);
    }
  }, [authToken, execute]);

  // If no token is provided, we consider it invalid.
  const isValid = authToken ? data : false;

  return {isValid, error, loading};
};

export default useTokenVerification;
