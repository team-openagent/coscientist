# Firebase Authentication Setup

This project includes Firebase authentication with Google sign-in for both signin and signup functionality.

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in provider
   - Add your authorized domains (localhost for development)

### 2. Environment Variables

1. Copy the environment variables template:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   You can find these values in your Firebase project settings > General > Your apps > SDK setup and configuration.

### 3. Run the Application

```bash
npm run dev
```

## Features

- **Google Authentication**: Sign in/up with Google accounts
- **Protected Routes**: Authentication state management
- **User Profile**: Display user information and photo
- **Responsive Design**: Mobile-friendly authentication pages
- **Error Handling**: Proper error messages for authentication failures

## Pages

- `/login` - Sign in page
- `/signup` - Sign up page
- `/` - Home page with authentication status

## Components

- `AuthContext` - Manages authentication state
- `Navigation` - Shows authentication status and navigation
- `LoginPage` - Sign in form
- `SignupPage` - Sign up form

## Authentication Flow

1. User visits `/login` or `/signup`
2. Clicks "Sign in/up with Google"
3. Google OAuth popup appears
4. User authenticates with Google
5. Firebase creates/updates user account
6. User is redirected to home page
7. Navigation shows user profile and sign out button

## Security Features

- Firebase handles all authentication securely
- No passwords stored locally
- Protected routes with authentication context
- Secure token management

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/popup-closed-by-user)"**
   - User closed the Google sign-in popup
   - This is normal behavior

2. **"Firebase: Error (auth/popup-blocked)"**
   - Browser blocked the popup
   - Allow popups for your domain

3. **Environment variables not working**
   - Make sure to restart the development server after adding `.env.local`
   - Verify all variables are prefixed with `NEXT_PUBLIC_`

### Development Tips

- Use browser dev tools to check for authentication errors
- Check Firebase console for authentication logs
- Verify domain is added to authorized domains in Firebase
