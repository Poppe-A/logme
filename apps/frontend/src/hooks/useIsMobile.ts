import { useContext } from 'react';
import { DeviceContext } from '../contexts/deviceContext';

export function useIsMobile() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceType must be used within a DeviceProvider');
  }
  return context === 'mobile';
}
