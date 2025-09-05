"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getAuthStatus, UserAuthStatus } from "@/utils/auth";
import { usePathname, useRouter } from "next/navigation";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

interface AuthContextType {
  user: UserAuthStatus | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManuallyLoggedOut, setIsManuallyLoggedOut] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter(); // from next/navigation (app router)
  const pathname = usePathname();

  const PUBLIC_PATHS = ["/", "/login", "/signup", "/change-password"];

  // 🔁 Refresh access token
  const refreshAccessToken = async () => {
    try {
      await axiosWithCsrf.post("/token/refresh/");

      console.log("🔄 Access token refreshed");

      const data = await getAuthStatus();
      setUser(data);
      setIsManuallyLoggedOut(false); // Allow re-auth again

      if (data?.exp) {
        startRefreshTimer(data.exp);
      }
    } catch (err) {
      console.error("❌ Token refresh failed. Logging out...");
      logout();
    }
  };

  // 🕒 Start refresh timer before expiry
  const startRefreshTimer = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const refreshDelay = (exp - now - 60) * 1000;

    if (refreshDelay <= 0) {
      refreshAccessToken();
      return;
    }

    console.log(
      `⏳ Scheduling token refresh in ${Math.round(refreshDelay / 1000)}s`
    );

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshDelay);
  };

  // 🔒 Check authentication once
  useEffect(() => {
    if (isManuallyLoggedOut) {
      setLoading(false);
      return;
    }

    getAuthStatus().then((data) => {
      setUser(data);
      setLoading(false);

      if (data?.exp) {
        startRefreshTimer(data.exp);
      }
    });

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [isManuallyLoggedOut]);

  useEffect(() => {
    if (!loading && !user && !PUBLIC_PATHS.includes(pathname)) {
      console.log("🔐 Not authenticated, redirecting to /login");
      router.push("/login"); // This is fine with app router
    }
  }, [loading, user, pathname]);

  // 🚪 Logout function
  const logout = async () => {
    try {
      await axiosWithCsrf.post("/auth/logout/", {});

      // ❌ Manually delete the user_status cookie
      document.cookie ="user_status=; path=/; max-age=0; SameSite=None; Secure";

      setUser(null);
      setIsManuallyLoggedOut(true); // Prevent re-auth
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      console.log("✅ Logged out successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
