import React, { createContext, useCallback, useContext, useState } from 'react';

type ReloadContextType = {
  refreshing: boolean;
  triggerRefresh: () => void;
  version: number;
};

const ReloadContext = createContext<ReloadContextType | null>(null);

export const ReloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [version, setVersion] = useState(0);

  const triggerRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    // simulate a refresh; consumers can watch `version` to re-run effects
    setTimeout(() => {
      setVersion((v) => v + 1);
      setRefreshing(false);
    }, 800);
  }, [refreshing]);

  return (
    <ReloadContext.Provider value={{ refreshing, triggerRefresh, version }}>
      {children}
    </ReloadContext.Provider>
  );
};

export function useReload() {
  const ctx = useContext(ReloadContext);
  if (!ctx) throw new Error('useReload must be used within a ReloadProvider');
  return ctx;
}
