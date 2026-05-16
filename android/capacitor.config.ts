import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.comiccrafte.studio',
  appName: 'ComicCrafte Studio',
  webDir: 'dist',

  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      updateUrl: 'https://plugin.capgo.app/updates'
    }
  }
};

export default config;