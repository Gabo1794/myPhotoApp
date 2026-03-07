import React, { createContext } from 'react';
import type { IAuthService } from '../services/interfaces/IAuthService';
import type { IAlbumService } from '../services/interfaces/IAlbumService';
import type { IMediaService } from '../services/interfaces/IMediaService';
import type { ISubscriptionService } from '../services/interfaces/ISubscriptionService';
import { SupabaseAuthService } from '../services/supabase/SupabaseAuthService';
import { SupabaseAlbumService } from '../services/supabase/SupabaseAlbumService';
import { SupabaseMediaService } from '../services/supabase/SupabaseMediaService';
import { SupabaseSubscriptionService } from '../services/supabase/SupabaseSubscriptionService';

export interface Services {
  auth: IAuthService;
  album: IAlbumService;
  media: IMediaService;
  subscription: ISubscriptionService;
}

const services: Services = {
  auth: new SupabaseAuthService(),
  album: new SupabaseAlbumService(),
  media: new SupabaseMediaService(),
  subscription: new SupabaseSubscriptionService(),
};

export const ServiceContext = createContext<Services>(services);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};
