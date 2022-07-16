import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : initialValue;
    } catch (error) {
      return initialValue;
    };
  });
  const setValue = value => {
    setStoredValue(value);
    window.localStorage.setItem(key, value);
  };
  return [storedValue, setValue];
};