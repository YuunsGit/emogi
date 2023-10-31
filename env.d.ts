declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KV_URL: string;
      NEXT_PUBLIC_COOLDOWN_MINS: number;
    }
  }
}
export {};
