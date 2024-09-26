import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AppState {
  // Define your state properties here
  isInSignup: boolean;
  isMobile: boolean;
}

interface AppContextProps {
  state: AppState;
  updateState: (partialState: Partial<AppState>) => void;
}

const initialState: AppState = {
  isInSignup: true,
  isMobile: false,
};

export const AppMainContext = createContext<AppContextProps | undefined>(undefined);

interface AppMainProviderProps {
  children: ReactNode;
}

export const AppMainProvider: React.FC<AppMainProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const checkIfMobile = function(): boolean {
    const isMobile = window.innerWidth < 800;

    return isMobile;
  }

  const updateState = (partialState: Partial<AppState>) => {
    setState(prevState => ({
      ...prevState,
      ...partialState,
    }));
  };

  useEffect(() => {
    updateState({isMobile: checkIfMobile()});

    window.addEventListener('resize', () => {
      updateState({isMobile: checkIfMobile()});
    });

  }, []);

  return (
    <AppMainContext.Provider value={{ state, updateState }}>
      {children}
    </AppMainContext.Provider>
  );
};
