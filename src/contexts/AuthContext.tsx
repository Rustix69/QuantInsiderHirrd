
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('hirrd_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call your backend API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: email === 'admin@hirrd.com' ? 'Admin User' : 'John Doe',
        email,
        bio: 'Software Developer with 5 years of experience',
        isAdmin: email === 'admin@hirrd.com'
      };
      
      setUser(mockUser);
      localStorage.setItem('hirrd_user', JSON.stringify(mockUser));
      
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration - in real app, this would call your backend API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        bio: '',
        isAdmin: false
      };
      
      setUser(newUser);
      localStorage.setItem('hirrd_user', JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: "Welcome to Hirrd. Your account has been created successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hirrd_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('hirrd_user', JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
