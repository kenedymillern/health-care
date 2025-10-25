// src/types/global.d.ts
export {};

type RecaptchaCallback = () => void;
type RecaptchaTokenCallback = (token: string) => void;

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: string | HTMLElement,
        parameters: {
          [key: string]: string | RecaptchaCallback | RecaptchaTokenCallback;
        }
      ) => void;
      reset: () => void;
      execute: () => void;
    };
    onRecaptchaSuccess?: RecaptchaTokenCallback;
    onRecaptchaExpired?: RecaptchaCallback;
  }
}
