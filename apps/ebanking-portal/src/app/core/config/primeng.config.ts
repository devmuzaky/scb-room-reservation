import { SCBThemePreset } from '@scb/ui/primeng';
import { providePrimeNG } from 'primeng/config';

export function providePrimeNGConfig() {
  return providePrimeNG({
    theme: {
      preset: SCBThemePreset,
      options: {
        darkModeSelector: '.dark',
      },
    },
  });
}
