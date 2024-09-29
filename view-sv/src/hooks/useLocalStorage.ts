import { useState } from "react";

type UseLocalStorageReturnType<T> = [T, (value: T) => void];

const useLocalStorage = function<T>(key: string, defaultValue: T): UseLocalStorageReturnType<T> {
  /**
   * <T> allows all types to be passed in
   * Example: useLocalStorage<number>('myNumber', 0)
   */
  const [storedValue, setStoredValue] = useState<T>(()=> {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log('Error in useLocalStorage.ts');
      console.error(error);
      return defaultValue;
    }
  });

  const setValue = function(value: T | ((value: T) => T)) {
    try {
      /*
       * Allow value to be a function so we have same API as useState
       * If function, pass current value to it
      */
    //  console.log('Current storedValue:');
    //  console.log(storedValue);
     
     const valueToStore = value instanceof Function ? value(storedValue) : value;

     console.log('Value changed ---------------------------------------------------');
     
     setStoredValue(valueToStore);
     window.localStorage.setItem(key, JSON.stringify(valueToStore));
     
    //  console.log('New storedValue:', localStorage.getItem('signupData'));


    } catch(error) {
      console.error(error);
    }
  }

  return [storedValue, setValue];

}

export default useLocalStorage;