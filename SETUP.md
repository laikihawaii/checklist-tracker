# Checklist Tracker Web App - Setup Guide

## Overview
This is a web-based checklist tracker app that syncs across all your devices using Firebase.

## Prerequisites
- Firebase account (free at https://console.firebase.google.com)
- A web browser (Chrome, Firefox, Safari, Edge)
- Git (optional, but recommended)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `checklist-tracker`
4. Accept terms and create project
5. Wait for project to be created

## Step 2: Set Up Firestore Database

1. In Firebase console, go to **Firestore Database** (left sidebar)
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select a location closest to you
5. Click **Enable**

## Step 3: Enable Email/Password Authentication

1. In Firebase console, go to **Authentication** (left sidebar)
2. Click **Sign-in method**
3. Click **Email/Password**
4. Toggle **Enable** on
5. Click **Save**

## Step 4: Set Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

## Step 5: Get Firebase Config

1. In Firebase console, click the gear icon → **Project Settings**
2. Scroll down to **Your apps** section
3. Click **Web** (looks like `</>`), or add a new web app if needed
4. Copy the config object (looks like the code below):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef..."
};
```

## Step 6: Update Firebase Config in App

1. Open `js/firebase-config.js` in a text editor
2. Replace the `firebaseConfig` object with your credentials from Step 5
3. Save the file

## Step 7: Deploy

### Option A: Deploy to Netlify (Recommended - Free)

1. Initialize git repo (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   - Create a GitHub account (if needed)
   - Create a new repository
   - Push this project to GitHub

3. Deploy to Netlify:
   - Go to [Netlify](https://www.netlify.com)
   - Click "Connect with GitHub"
   - Select your repository
   - Netlify will auto-deploy
   - You'll get a web link like: `https://your-app.netlify.app`

### Option B: Deploy to Vercel (Also Free)

1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Import from Git (GitHub)
4. Select your repository
5. Deploy
6. You'll get a web link like: `https://your-app.vercel.app`

### Option C: Self-Host

1. Upload all files to your web server
2. Access via your server's URL
3. Ensure `firebase-config.js` has your credentials

## Step 8: Access Your App

1. Visit your deployed URL
2. Create an account with email/password
3. Start using the checklist app!

## Features

- **Create Tasks**: Click "New Task" to start a new checklist task
- **Add Items**: Go to Template tab to add items and organize them in groups
- **Check Off Items**: Check items as you complete them
- **View Statistics**: See how often each item has been completed
- **Edit Template**: Customize your checklist items and groups
- **Multi-Device Sync**: Log in on any device and see your data automatically

## Troubleshooting

### "Firebase is not defined"
- Make sure `firebase-config.js` is loaded correctly
- Check that the script tags in `index.html` are in the correct order
- Wait a few seconds for Firebase SDK to load

### "Permission denied" errors
- Check your Firestore security rules (Step 4)
- Make sure you're logged in with an email/password account
- Clear browser cookies and try logging in again

### Data not syncing
- Check your internet connection
- Verify Firebase config is correct
- Check browser console for errors (F12 → Console)

### Tasks not appearing
- Make sure you've created a task (click "New Task")
- If using multiple browsers, they should sync automatically
- Refresh the page if data doesn't appear

## Local Testing

To test locally before deploying:

1. Start a local web server:
   ```bash
   python -m http.server 8000
   ```

2. Visit `http://localhost:8000` in your browser

3. Test all features

## Support

For issues with:
- **Firebase**: https://firebase.google.com/support
- **Netlify**: https://support.netlify.com
- **App Code**: Check the browser console (F12 → Console tab)

## Next Steps

- Customize the app colors in `css/styles.css`
- Add more checklist items in the Template tab
- Create multiple tasks to see statistics
- Share the web link with others if you want them to use it

Enjoy your checklist tracker! 🎉
