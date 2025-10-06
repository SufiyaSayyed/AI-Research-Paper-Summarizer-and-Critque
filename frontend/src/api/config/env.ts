export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiVersion: import.meta.env.VITE_API_VERSION,
  nodeEnv: import.meta.env.VITE_NODE_ENV,
} as const;
