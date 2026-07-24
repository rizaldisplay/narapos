import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type User = {
  name: string;
  phone: string;
  email?: string;
};

type Store = {
  name: string;
  type: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  timezone?: string;
  currency?: string;
  tax?: string;
  printer?: string;
  cashierName?: string;
  cashierUsername?: string;
};

type AppState = {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  hasSeenWelcomeDashboard: boolean;
  user: User | null;
  store: Store | null;
};

type AppContextType = {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  completeOnboarding: (store: Store) => void;
  setHasSeenWelcomeDashboard: () => void;
};

const defaultState: AppState = {
  isAuthenticated: false,
  isOnboarded: false,
  hasSeenWelcomeDashboard: false,
  user: null,
  store: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem('narapos_state');
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem('narapos_state', JSON.stringify(state));
  }, [state]);

  const login = (user: User) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user,
    }));
  };

  const logout = () => {
    setState(defaultState);
  };

  const completeOnboarding = (store: Store) => {
    setState((prev) => ({
      ...prev,
      isOnboarded: true,
      store,
    }));
  };

  const setHasSeenWelcomeDashboard = () => {
    setState((prev) => ({
      ...prev,
      hasSeenWelcomeDashboard: true,
    }));
  };

  return (
    <AppContext.Provider value={{ state, login, logout, completeOnboarding, setHasSeenWelcomeDashboard }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
