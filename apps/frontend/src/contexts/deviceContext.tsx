import { createContext } from 'react';

type DeviceType = 'mobile' | 'desktop';

export const DeviceContext = createContext<DeviceType | undefined>(undefined);
