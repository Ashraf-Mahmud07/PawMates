import SideDrawer from '@/components/side-drawer';
import React, { createContext, useCallback, useContext, useState } from 'react';

type DrawerContextValue = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export const SideDrawerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <SideDrawer open={open} onClose={closeDrawer} />
    </DrawerContext.Provider>
  );
};

export function useSideDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useSideDrawer must be used within SideDrawerProvider');
  return ctx;
}

export default DrawerContext;
