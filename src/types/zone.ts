export type Zone = 'creativity' | 'hotel';

export interface ZoneContextValue {
  zone: Zone;
  setZone: (zone: Zone) => void;
  toggleZone: () => void;
}
