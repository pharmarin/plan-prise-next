declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      APP_ENV: string;
      APP_KEY: string;
      APP_DEBUG: string;
      APP_URL: string;
      FRONTEND_URL: string;
      RECAPTCHA_SECRET: string;
      NEXT_PUBLIC_CAPTCHA_SITE_KEY: string;
      SESSION_DOMAIN: string;
      LOG_CHANNEL: string;
      LOG_DEPRECATIONS_CHANNEL: string;
      LOG_LEVEL: string;
      DB_CONNECTION: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_DATABASE: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      MYSQL_ATTR_SSL_CA: string;
      BROADCAST_DRIVER: string;
      CACHE_DRIVER: string;
      FILESYSTEM_DISK: string;
      QUEUE_CONNECTION: string;
      SESSION_DRIVER: string;
      SESSION_LIFETIME: string;
      MAIL_MAILER: string;
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USERNAME: string;
      MAIL_PASSWORD: string;
      MAIL_ENCRYPTION: string;
      MAIL_FROM_ADDRESS: string;
      MAIL_FROM_NAME: string;
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

export {}
