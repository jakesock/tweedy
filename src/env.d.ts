declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_URL: string;
      POSTGRES_PRISMA_URL: string;
      POSTGRES_URL_NO_SSL: string;
      POSTGRES_URL_NON_POOLING: string;
      POSTGRES_USER: string;
      POSTGRES_HOST: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DATABASE: string;
      UPLOADTHING_SECRET: string;
      NEXT_PUBLIC_UPLOADTHING_APP_ID: string;
    }
  }
}

export {};