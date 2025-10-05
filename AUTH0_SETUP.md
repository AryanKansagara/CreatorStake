# Auth0 Setup Guide

## 1. Create Auth0 Account and Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new account or sign in
3. Create a new application:
   - Choose "Single Page Application"
   - Name it "CreatorStake" or similar

## 2. Configure Auth0 Application

### Application Settings
- **Allowed Callback URLs**: `http://localhost:8080, http://localhost:3000`
- **Allowed Logout URLs**: `http://localhost:8080, http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:8080, http://localhost:3000`
- **Allowed Origins (CORS)**: `http://localhost:8080, http://localhost:3000`

### Advanced Settings
- **Grant Types**: Enable "Authorization Code" and "Refresh Token"
- **Token Endpoint Authentication Method**: None

## 3. Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-identifier
```

Replace the values with your actual Auth0 credentials from the dashboard.

## 4. Optional: API Configuration

If you want to protect API endpoints:

1. In Auth0 Dashboard, go to "Applications" > "APIs"
2. Create a new API
3. Set the identifier (this becomes your `REACT_APP_AUTH0_AUDIENCE`)
4. Configure scopes as needed

## 5. User Management

Auth0 handles user registration and login automatically. Users can:
- Sign up with email/password
- Use social logins (Google, Facebook, etc.)
- Reset passwords
- Manage their profiles

## 6. Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Click "Sign In with Auth0" or "Sign Up with Auth0"
4. You'll be redirected to Auth0's hosted login page
5. After authentication, you'll be redirected back to your app

## 7. Customization

You can customize the Auth0 login page in the Auth0 Dashboard under "Branding" > "Universal Login".

## 8. Production Deployment

For production, update the callback URLs and origins to your production domain:

- **Allowed Callback URLs**: `https://yourdomain.com`
- **Allowed Logout URLs**: `https://yourdomain.com`
- **Allowed Web Origins**: `https://yourdomain.com`
- **Allowed Origins (CORS)**: `https://yourdomain.com`
