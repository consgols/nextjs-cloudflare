'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export type LoaderContextValue = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const LoaderContext = createContext<LoaderContextValue | undefined>(undefined);

type LoaderProviderProps = {
  children: ReactNode;
};

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const value: LoaderContextValue = { loading, setLoading };
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
};

export const useLoader = (): LoaderContextValue => {
  const ctx = useContext(LoaderContext);

  if (!ctx) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  return ctx;
};
