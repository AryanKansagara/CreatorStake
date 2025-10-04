import { createContext, useContext, ReactNode } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';

interface Auth0ContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect: () => void;
  logout: () => void;
}

const Auth0Context = createContext<Auth0ContextProps | undefined>(undefined);

export function Auth0Provider({ children }: { children: ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout
  } = useAuth0();

  return (
    <Auth0Context.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        loginWithRedirect,
        logout
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
}

export function useAuth0Context() {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth0Context must be used within an Auth0Provider');
  }
  return context;
}