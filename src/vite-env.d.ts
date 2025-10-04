/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN: string
  readonly VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN: string
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_USE_MOCK_PAYMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

