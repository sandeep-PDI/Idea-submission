export const oktaConfig = {
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  scopes: ['openid', 'profile', 'email', 'groups'],
  tokenManager: {
    storage: 'localStorage',
    autoRenew: true,
    expireEarlySeconds: 120,
  }
};