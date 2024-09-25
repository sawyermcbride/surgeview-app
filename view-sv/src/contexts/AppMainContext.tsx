import React, { createContext, useState, ReactNode } from 'react';

interface AppState {
  // Define your state properties here
  isInSignup: boolean;
}

interface AppContextProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setPartialState: (partialState: Partial<AppState>) => void;
}

const initialState: AppState = {
  isInSignup: true,
};

export const AppMainContext = createContext<AppContextProps | undefined>(undefined);

interface AppMainProviderProps {
  children: ReactNode;
}

export const AppMainProvider: React.FC<AppMainProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setPartialState = (partialState: Partial<AppState>) => {
    setState(prevState => ({
      ...prevState,
      ...partialState,
    }));
  };

  return (
    <AppMainContext.Provider value={{ state, setState, setPartialState }}>
      {children}
    </AppMainContext.Provider>
  );
};
