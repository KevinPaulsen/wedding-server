import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';

export function useFormFields<T>(
    initialState: T
): [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] {
  const [fields, setFields] = useState<T>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  return [fields, handleChange, setFields];
}
