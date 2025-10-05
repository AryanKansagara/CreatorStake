export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-example.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'example-client-id',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://api.example.com',
    scope: 'openid profile email'
  }
};
