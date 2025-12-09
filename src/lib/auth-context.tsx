import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, mockUsers, demoCredentials } from './mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check demo credentials
    const isValidAdmin = username === demoCredentials.admin.username && password === demoCredentials.admin.password;
    const isValidDoctor = username === demoCredentials.doctor.username && password === demoCredentials.doctor.password;
    const isValidReceptionist = username === demoCredentials.receptionist.username && password === demoCredentials.receptionist.password;

    if (isValidAdmin || isValidDoctor || isValidReceptionist) {
      const foundUser = mockUsers.find(u => u.username === username);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('hms_user', JSON.stringify(foundUser));
        localStorage.setItem('hms_token', 'mock-jwt-token-' + foundUser.id);
        return { success: true };
      }
    }

    return { success: false, error: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRequireAuth = (allowedRoles?: UserRole[]) => {
  const { user, isAuthenticated } = useAuth();
  
  const hasAccess = isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)));
  
  return { user, isAuthenticated, hasAccess };
};
