declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      PRODUCTION_URL: string;
      BACKEND_URL: string;
      RECAPTCHA_SECRET: string;
      NEXT_PUBLIC_CAPTCHA_SITE_KEY: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_DATABASE: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      MAIL_FROM_ADDRESS: string;
      MAILERSEND_API_KEY: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      NTFY_ADMIN_URL: string;
      DATABASE_URL: string;
      PLAYWRIGHT_TEST_BASE_URL: string;
      MAILSLURP_API_KEY: string;
      MAIL_TEST_DOMAIN: string;
      CROSS_SITE_SECRET: string;
    }
  }
}

export {};
