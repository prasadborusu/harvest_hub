import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

// ─── Hardcoded Credentials ───────────────────────────────────────────────────
// Each account has a fixed role – no separate role-selection step needed.
const USERS: Record<string, { password: string; role: UserRole; displayName: string }> = {
  farmer: { password: 'farmer123', role: UserRole.FARMER,  displayName: 'Farmer' },
  buyer:  { password: 'buyer123',  role: UserRole.BUYER,   displayName: 'Buyer'  },
  seller: { password: 'seller123', role: UserRole.SELLER,  displayName: 'Seller' },
};

const SESSION_KEY = 'harvesthub-session';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on first load
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const key = username.trim().toLowerCase();
    const record = USERS[key];
    if (!record) {
      throw new Error('Invalid username. Use: farmer, buyer, or seller.');
    }
    if (record.password !== password) {
      throw new Error('Incorrect password.');
    }
    const loggedInUser: User = {
      username: key,
      role: record.role,
      displayName: record.displayName,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};