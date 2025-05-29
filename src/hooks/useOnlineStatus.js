import { useState, useEffect } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    // Define event handlers
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// Additional network-related hooks

export function useNetworkSpeed() {
  const [connectionType, setConnectionType] = useState("unknown");

  useEffect(() => {
    if ("connection" in navigator) {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      const updateConnectionInfo = () => {
        setConnectionType(connection.effectiveType || "unknown");
      };

      updateConnectionInfo();
      connection.addEventListener("change", updateConnectionInfo);

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }
  }, []);

  return connectionType;
}

export function useNetworkStatus() {
  const isOnline = useOnlineStatus();
  const connectionType = useNetworkSpeed();

  return {
    isOnline,
    connectionType,
    isSlowConnection: connectionType === "2g" || connectionType === "slow-2g",
    isFastConnection: connectionType === "4g",
  };
}
