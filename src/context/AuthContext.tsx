import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, UserRole } from "../types";
import api from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    const token = response.token;
    if (!token) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("authToken", token);

    // Decode JWT to get user info (basic decoding)
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("JWT Payload:", payload); // Debug: see what's in the token

    // Extract role from various possible JWT structures
    let userRole: UserRole = "CLIENT";
    if (payload.role) {
      // Single role field (string)
      userRole =
        typeof payload.role === "string" ? payload.role : payload.role.name;
    } else if (payload.roles && payload.roles.length > 0) {
      // Handle roles array/set - could be strings or objects
      const firstRole = payload.roles[0];
      if (typeof firstRole === "string") {
        // Strip ROLE_ prefix if present (e.g., 'ROLE_ADMIN' -> 'ADMIN')
        userRole = firstRole.replace("ROLE_", "") as UserRole;
      } else if (firstRole.name) {
        userRole = firstRole.name.replace("ROLE_", "") as UserRole;
      } else if (firstRole.authority) {
        userRole = firstRole.authority.replace("ROLE_", "") as UserRole;
      }
    } else if (payload.authorities && payload.authorities.length > 0) {
      // Handle Spring Security authorities format
      const authority = payload.authorities.find(
        (a: string | { authority: string }) =>
          typeof a === "string"
            ? a.startsWith("ROLE_")
            : a.authority?.startsWith("ROLE_"),
      );
      if (authority) {
        userRole = (
          typeof authority === "string" ? authority : authority.authority
        ).replace("ROLE_", "") as UserRole;
      }
    }

    const userData: User = {
      id: payload.sub || payload.id || payload.userId,
      email: payload.email || payload.username || email,
      role: userRole,
      nom: payload.nom || payload.lastName,
      prenom: payload.prenom || payload.firstName,
    };

    console.log("User Data:", userData); // Debug: see extracted user data
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
