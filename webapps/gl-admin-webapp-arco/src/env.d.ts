/// <reference types="vite/client" />

declare module '*.vue' {
  import {DefineComponent} from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_PROTOCOL: string;
  readonly VITE_API_BASE_HOSTNAME: string;
  readonly VITE_API_BASE_PORT: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEB_PREFIX_URL: string;
}
