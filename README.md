# Checklist Tracker - Web App

A modern, responsive checklist tracker web app that syncs across all your devices using Firebase.

## Features

✅ **Multi-Device Access**: Access from phone, tablet, or desktop
✅ **Real-time Sync**: Changes sync instantly across devices
✅ **Organized Templates**: Group checklist items for better organization
✅ **Task Management**: Create, rename, and delete tasks
✅ **Statistics**: Track completion percentage for each item
✅ **Responsive Design**: Works perfectly on mobile and desktop
✅ **No Installation**: Just open a link, log in, and start using

## Quick Start

### 1. Firebase Setup (5 minutes)

Follow the [SETUP.md](SETUP.md) guide to:
- Create a Firebase project
- Configure Firestore database
- Enable Email/Password authentication
- Get your Firebase credentials

### 2. Update Firebase Config

Edit `js/firebase-config.js` and replace the placeholder credentials with your Firebase project credentials.

### 3. Deploy

Choose one of these free deployment options:

- **Netlify** (Recommended): Connect your GitHub repo for auto-deployment
- **Vercel**: Similar to Netlify, also free
- **Self-hosted**: Upload to any web server

### 4. Start Using!

Visit your deployed URL, create an account, and start tracking your checklist!

## Project Structure

```
checklist-web-app/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Responsive styling
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── data-manager.js     # Firestore operations
│   ├── ui.js               # UI rendering logic
│   └── app.js              # Main app orchestration
├── SETUP.md                # Detailed setup guide
└── README.md               # This file
```

## How to Use

### Checklist Tab
- **New Task**: Click to create a new daily task
- **Rename Task**: Modify the current task name
- **Delete Task**: Remove the current task
- **Navigation**: Use Previous/Next to view other tasks
- **Check Items**: Mark items as complete

### Statistics Tab
- View how many times each item was checked
- See completion percentage
- Track trends over time

### Template Tab
- **Add Groups**: Organize items into categories
- **Add Items**: Create checklist items
- **Edit/Delete**: Modify existing items and groups
- **Reorder**: Use up/down buttons to organize

## Authentication

The app uses Email/Password authentication through Firebase:
- Create a new account with your email
- Log in from any device with the same credentials
- Your data is private and only accessible by you

## Data Storage

All data is stored securely in Firebase Firestore:
- Encrypted in transit (HTTPS)
- User data is isolated (only visible to the account owner)
- Real-time synchronization across devices

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Can't log in?
- Check your email and password
- Make sure you created an account first
- Clear browser cookies and try again

### Data not showing?
- Check your internet connection
- Verify you're logged in to the same account
- Refresh the page (F5)
- Check browser console for errors (F12)

### Changes not syncing?
- Wait a few seconds (Firebase needs time to sync)
- Refresh the page
- Check your Firebase security rules in SETUP.md

## Local Development

To test locally before deploying:

```bash
# Start a local web server
python -m http.server 8000

# Visit http://localhost:8000
```

## Deployment

### Deploy to Netlify

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/checklist-tracker.git
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select your GitHub repository
   - Deploy!

### Deploy to Vercel

1. Push to GitHub (same as above)

2. Connect to Vercel:
   - Go to https://vercel.com
   - Click "New Project"
   - Import from Git
   - Deploy!

## Customization

### Change Colors
Edit `css/styles.css` and modify the `:root` variables:
```css
:root {
    --primary: #007AFF;        /* Blue */
    --danger: #FF3B30;         /* Red */
    --success: #34C759;        /* Green */
    /* ... more colors ... */
}
```

### Change App Name
1. Edit `<title>` in `index.html`
2. Edit `<h1>` text in `index.html`

## Security

- All data is encrypted in transit (HTTPS)
- Firestore security rules ensure only you can access your data
- Passwords are hashed by Firebase Authentication
- No sensitive data is stored on the client side

## Privacy

- Your data is stored only in your Firebase project
- The app doesn't collect any analytics or tracking data
- You have full control over your data in Firebase

## Future Enhancements

Potential features for future versions:
- Export data to CSV
- Dark mode
- Multiple checklist templates
- Search functionality
- Backup/restore features
- Collaborative lists (share with others)

## Support

For help:
- Check [SETUP.md](SETUP.md) for Firebase setup issues
- See browser console for errors (F12 → Console)
- Check Firebase documentation: https://firebase.google.com/docs

## License

MIT

## Version History

**v1.0.0** (2026-05-08)
- Initial release
- Email/Password authentication
- Full CRUD operations for tasks and items
- Real-time synchronization
- Responsive design
- Statistics tracking

---

Made with ❤️ for checklist lovers
