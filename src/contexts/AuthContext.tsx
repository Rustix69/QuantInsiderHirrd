import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";

// List of admin email addresses
const ADMIN_EMAILS = ['rustix80@gmail.com'];

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

  // Check if an email is an admin email
  const isAdminEmail = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  useEffect(() => {
    // Check for existing session in Supabase
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const userData = session.user;
        // Map Supabase user to our User interface
        setUser({
          id: userData.id,
          name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          bio: userData.user_metadata?.bio || '',
          isAdmin: isAdminEmail(userData.email || '')
        });
      } else {
        // Check for existing session in localStorage (for backward compatibility)
        const savedUser = localStorage.getItem('hirrd_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = session.user;
          const newUser = {
            id: userData.id,
            name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'User',
            email: userData.email || '',
            bio: userData.user_metadata?.bio || '',
            isAdmin: isAdminEmail(userData.email || '')
          };
          
          setUser(newUser);
          localStorage.setItem('hirrd_user', JSON.stringify(newUser));
          
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('hirrd_user');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const newUser = {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: email,
          bio: data.user.user_metadata?.bio || 'Software Developer with 5 years of experience',
          isAdmin: isAdminEmail(email)
        };
        
        setUser(newUser);
        localStorage.setItem('hirrd_user', JSON.stringify(newUser));
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            bio: ''
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const newUser = {
          id: data.user.id,
          name,
          email,
          bio: '',
          isAdmin: isAdminEmail(email)
        };
        
        setUser(newUser);
        localStorage.setItem('hirrd_user', JSON.stringify(newUser));
        
        toast({
          title: "Account created!",
          description: "Welcome to Hirrd. Your account has been created successfully.",
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      localStorage.removeItem('hirrd_user');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    });
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      
      // Update user metadata in Supabase
      supabase.auth.updateUser({
        data: {
          name: updatedUser.name,
          bio: updatedUser.bio
        }
      }).then(({ error }) => {
        if (!error) {
          setUser(updatedUser);
          localStorage.setItem('hirrd_user', JSON.stringify(updatedUser));
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
        } else {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
