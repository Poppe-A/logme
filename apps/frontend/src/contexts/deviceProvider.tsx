import React, { type ReactNode, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DeviceContext } from './deviceContext';

type DeviceType = 'mobile' | 'desktop';

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const deviceType = useMemo<DeviceType>(
    () => (isMobile ? 'mobile' : 'desktop'),
    [isMobile],
  );

  return (
    <DeviceContext.Provider value={deviceType}>
      {children}
    </DeviceContext.Provider>
  );
};
