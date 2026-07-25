import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type User = {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
};

type Store = {
  id?: string;
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
  isLoading: boolean; // Flag penting saat check token diawal
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  store: Store | null;
};

type AuthPayload = {
  user: User;
  accessToken: string;
  refreshToken?: string;
  store?: Store | null;
};

type AppContextType = {
  state: AppState;
  login: (payload: AuthPayload) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  completeOnboarding: (store: Store) => void;
  setHasSeenWelcomeDashboard: () => void;
};

const defaultState: AppState = {
  isAuthenticated: false,
  isOnboarded: false,
  hasSeenWelcomeDashboard: false,
  isLoading: true, // Set true di awal agar Route Guard menunggu proses verifikasi
  accessToken: null,
  refreshToken: null,
  user: null,
  store: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'narapos_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  // Helper untuk mengecek apakah JWT sudah kadaluarsa (opsional tanpa library)
  const isTokenExpired = (token: string): boolean => {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      if (!decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  };

  // 1. Initial Load / Hydration Check
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState: AppState = JSON.parse(stored);

          // Validasi JWT Access Token
          if (parsedState.accessToken && !isTokenExpired(parsedState.accessToken)) {
            setState({
              ...parsedState,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }

          // Jika token ada tapi expired, kamu bisa panggil fungsi refresh token di sini.
          // Untuk sekarang jika token invalid/expired, kita reset state.
        }
      } catch (error) {
        console.error('Failed to parse auth state:', error);
      }

      // Fallback jika tidak ada token atau token expired
      setState({ ...defaultState, isLoading: false });
    };

    initializeAuth();
  }, []);

  // 2. Persist State ke LocalStorage setiap ada perubahan (kecuali isLoading)
  useEffect(() => {
    if (!state.isLoading) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isLoading, ...stateToSave } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [state]);

  // 3. Login Handler (Menerima User & Tokens dari Backend)
  const login = useCallback((payload: AuthPayload) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken || prev.refreshToken,
      user: payload.user,
      store: payload.store || prev.store,
      isOnboarded: Boolean(payload.store || prev.isOnboarded),
    }));
  }, []);

  // 4. Logout Handler
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...defaultState,
      isLoading: false,
    });
  }, []);

  // 5. Helper Update Token (Biasa dipanggil oleh Axios Interceptor saat Refresh Token)
  const updateTokens = useCallback((accessToken: string, refreshToken?: string) => {
    setState((prev) => ({
      ...prev,
      accessToken,
      refreshToken: refreshToken || prev.refreshToken,
    }));
  }, []);

  // 6. Complete Onboarding Handler
  const completeOnboarding = useCallback((store: Store) => {
    setState((prev) => ({
      ...prev,
      isOnboarded: true,
      store,
    }));
  }, []);

  // 7. Welcome Dashboard Handler
  const setHasSeenWelcomeDashboard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasSeenWelcomeDashboard: true,
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        updateTokens,
        completeOnboarding,
        setHasSeenWelcomeDashboard,
      }}
    >
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