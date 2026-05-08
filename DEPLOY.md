# Deployment Checklist

Before deploying your checklist tracker app, complete these steps:

## Pre-Deployment ✓

- [ ] **Firebase Config Updated**
  - [ ] Opened `js/firebase-config.js`
  - [ ] Replaced Firebase credentials with your project credentials
  - [ ] Verified all fields are filled (apiKey, authDomain, etc.)
  - [ ] Saved the file

- [ ] **Firestore Security Rules Set**
  - [ ] Logged into Firebase Console
  - [ ] Navigated to Firestore Database → Rules
  - [ ] Applied the security rules from SETUP.md
  - [ ] Clicked Publish

- [ ] **Email/Password Auth Enabled**
  - [ ] In Firebase, went to Authentication → Sign-in method
  - [ ] Toggled Email/Password on
  - [ ] Saved changes

- [ ] **Local Testing Passed**
  - [ ] Started local server: `python -m http.server 8000`
  - [ ] Visited http://localhost:8000
  - [ ] Tested account creation
  - [ ] Tested login/logout
  - [ ] Created a test task
  - [ ] Added checklist items
  - [ ] Verified checkboxes work
  - [ ] Viewed statistics

- [ ] **Code is Committed**
  - [ ] Ran `git add .`
  - [ ] Ran `git commit -m "..."`
  - [ ] Pushed to GitHub: `git push`

## Deployment Options

### Option 1: Netlify (Recommended) ⭐

- [ ] Created GitHub account (if needed)
- [ ] Pushed code to GitHub repository
- [ ] Created Netlify account at https://netlify.com
- [ ] Connected GitHub account to Netlify
- [ ] Selected checklist-web-app repository
- [ ] Clicked Deploy
- [ ] Got deployment URL
- [ ] Tested deployed app works
- [ ] Saved deployment URL somewhere safe

### Option 2: Vercel

- [ ] Created GitHub account (if needed)
- [ ] Pushed code to GitHub repository
- [ ] Created Vercel account at https://vercel.com
- [ ] Connected GitHub account to Vercel
- [ ] Selected checklist-web-app project
- [ ] Clicked Deploy
- [ ] Got deployment URL
- [ ] Tested deployed app works

### Option 3: Manual Hosting

- [ ] Downloaded all files from repository
- [ ] Uploaded to web hosting (Bluehost, GoDaddy, etc.)
- [ ] Updated Firebase config with new domain
- [ ] Tested app on your domain

## Post-Deployment ✓

- [ ] **App is Live**
  - [ ] Visited deployment URL
  - [ ] App loaded successfully
  - [ ] No console errors (F12 → Console)

- [ ] **Account Creation Works**
  - [ ] Created test account with new email
  - [ ] Successfully logged in
  - [ ] Successfully logged out

- [ ] **Core Features Work**
  - [ ] Created new task
  - [ ] Added checklist item
  - [ ] Checked off item
  - [ ] Item stayed checked
  - [ ] Navigated to statistics

- [ ] **Multi-Device Testing (Optional)**
  - [ ] Logged in on mobile phone
  - [ ] Created a task on phone
  - [ ] Checked item on phone
  - [ ] Opened desktop browser
  - [ ] Logged in with same account
  - [ ] Verified task appears
  - [ ] Verified checked item is marked
  - [ ] Made changes on desktop
  - [ ] Verified changes appear on phone

- [ ] **Share Your App**
  - [ ] Copied deployment URL
  - [ ] Bookmarked in browser
  - [ ] Saved URL in password manager
  - [ ] (Optional) Shared with others

## Troubleshooting During Deployment

### "Firebase is not defined"
**Solution**:
- Check if Firebase SDK loaded (should take 2-3 seconds)
- Check browser console (F12 → Console)
- Make sure `firebase-config.js` has the Firebase CDN links

### "CORS Error"
**Solution**:
- This shouldn't happen if using Netlify/Vercel
- If self-hosting, check if domain is whitelisted in Firebase settings

### "Permission denied" in Console
**Solution**:
- Verify Firestore security rules were published
- Check rules in Firebase Console → Firestore → Rules tab
- Make sure rules match the ones in SETUP.md

### Can't Create Account
**Solution**:
- Check if Email/Password auth is enabled in Firebase
- Firebase Console → Authentication → Sign-in method
- Make sure Email/Password is toggled ON
- Try with a different email address

### Data Not Persisting
**Solution**:
- Check browser console for errors
- Verify Firebase config is correct
- Check Firebase Firestore has data (go to console and look at `users` collection)
- Make sure you're logged in

## Maintenance

### Regular Tasks
- [ ] Monitor Firebase usage (free tier has limits)
- [ ] Check for console errors occasionally
- [ ] Update Firebase SDK if needed
- [ ] Keep GitHub repository up to date

### Firebase Free Tier Limits
- 1 GB total storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

For personal use, these limits are more than enough.

### Monitoring Usage
1. Go to Firebase Console
2. Click "Usage"
3. View daily reads/writes
4. Set up billing alerts if needed (optional)

## What's Deployed

Your deployment includes:
- Complete web app (HTML, CSS, JavaScript)
- Firebase integration (real database)
- Email/Password authentication
- SSL/HTTPS (automatic with Netlify/Vercel)
- Mobile responsive design
- Real-time data sync

## Success Checklist ✓

Once everything is working:

- [ ] Web app is live and accessible
- [ ] Account creation works
- [ ] Tasks persist between sessions
- [ ] Data syncs across devices
- [ ] All UI elements work
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] You have the deployment URL saved

## Next Steps

1. **Use it daily**: Start using your checklist app
2. **Customize**: Change colors in `css/styles.css` if desired
3. **Share**: Send the URL to others if you want them to use it
4. **Scale up**: Add more checklist items and tasks

## Support

If something goes wrong:
1. Check browser console (F12 → Console)
2. Read error messages carefully
3. Check [SETUP.md](SETUP.md) for Firebase setup
4. Check [README.md](README.md) for general info
5. Check Firebase/Netlify/Vercel documentation

---

You're ready to deploy! 🚀

**Need help?** Start from SETUP.md and follow each step carefully.
