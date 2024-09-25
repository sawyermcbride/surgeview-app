import { useEffect, useState } from "react";

type UseLocalStorageReturnType<T> = [T, (value: T) => void];

const useLocalStorage = function<T>(key: string, defaultValue: T): UseLocalStorageReturnType<T> {

  const [storedValue, setStoredValue] = useState((key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  });

  const setValue = function(value: T | ((value: T) => T)) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch(error) {
      console.error(error);
    }
  }

  return [storedValue, setValue];

}

export default useLocalStorage;