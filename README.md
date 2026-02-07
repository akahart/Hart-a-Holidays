# 🏝️ Hart's Holidays - PWA Deployment Guide

A beautiful Progressive Web App to track your upcoming holidays, flights, hotels, and activities with real-time sync across devices.

## 🎯 Features

- ✈️ Track multiple holidays with countdowns
- 📅 Automatic status: Upcoming, Current, or Past
- 🔄 Real-time sync between devices using Firebase
- 🔐 Password-protected admin panel
- 📱 Works offline as a PWA
- 🎨 Beautiful beach/travel themed interface
- 📊 Detailed flight, hotel, and activity tracking

---

## 📋 Prerequisites

You'll need:
1. A **GitHub account** (free) - [Sign up here](https://github.com/join)
2. A **Firebase account** (free) - Uses your Google account
3. **Git installed** on your computer (optional, can use GitHub web interface)

---

## 🚀 Part 1: Firebase Setup (5 minutes)

Firebase will handle the cloud database so both phones stay in sync.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `harts-holidays` (or any name you like)
4. Disable Google Analytics (not needed) or leave it on
5. Click **"Create project"**
6. Wait for it to finish, then click **"Continue"**

### Step 2: Add Web App to Firebase

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app with nickname: `Hart's Holidays Web`
3. **Check** "Also set up Firebase Hosting" (optional but recommended)
4. Click **"Register app"**
5. You'll see a code snippet with your Firebase configuration - **KEEP THIS OPEN**, you'll need it soon

### Step 3: Enable Firestore Database

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select a location (choose closest to you: europe-west, us-central, etc.)
5. Click **"Enable"**

### Step 4: Set Up Security Rules

1. Still in Firestore Database, click the **"Rules"** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /holidays/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**Note:** These rules allow anyone to read/write. Your admin password protects the admin page, but for extra security you could add authentication later.

### Step 5: Copy Your Firebase Config

From the Firebase config snippet you saw earlier, copy these values:
- apiKey
- authDomain  
- projectId
- storageBucket
- messagingSenderId
- appId

**Keep these handy - you'll need them in Part 3!**

---

## 🌐 Part 2: GitHub Pages Setup (5 minutes)

GitHub Pages will host your PWA for free.

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+" icon** in top right → **"New repository"**
3. Repository name: `harts-holidays` (must be lowercase)
4. Make it **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README
6. Click **"Create repository"**

### Step 2: Upload Files

**Option A: Using GitHub Web Interface (Easiest)**

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL files from the `harts-holidays` folder I created
3. Write commit message: "Initial commit"
4. Click **"Commit changes"**

**Option B: Using Git Command Line**

```bash
cd /path/to/harts-holidays
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harts-holidays.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, click **"Settings"** tab
2. In left sidebar, click **"Pages"**
3. Under "Source", select **"main"** branch
4. Click **"Save"**
5. Wait 1-2 minutes for deployment
6. Your site will be live at: `https://YOUR_USERNAME.github.io/harts-holidays/`

---

## 🔧 Part 3: Configure Firebase in Your App

Now connect your app to Firebase.

### Step 1: Edit config.js

1. In GitHub, navigate to `config.js` file
2. Click the **pencil icon** (Edit)
3. Replace the placeholder values with your Firebase config from Part 1:

```javascript
export const firebaseConfig = {
    apiKey: "AIzaSyC...", // Your actual API key
    authDomain: "harts-holidays-xxxxx.firebaseapp.com", // Your actual domain
    projectId: "harts-holidays-xxxxx", // Your actual project ID
    storageBucket: "harts-holidays-xxxxx.appspot.com", // Your actual bucket
    messagingSenderId: "123456789", // Your actual sender ID
    appId: "1:123456789:web:xxxxx" // Your actual app ID
};

export const ADMIN_PASSWORD = "Hilife69!";
```

4. Click **"Commit changes"**
5. Wait 1-2 minutes for GitHub Pages to rebuild

---

## 📱 Part 4: Install on iPhones

### Step 1: Open on First iPhone

1. Open **Safari** on iPhone (must be Safari, not Chrome)
2. Go to: `https://YOUR_USERNAME.github.io/harts-holidays/`
3. Tap the **Share button** (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Edit the name if you want (default: "Hart's Holidays")
6. Tap **"Add"**

The app icon will appear on your home screen like a native app!

### Step 2: Install on Second iPhone

Repeat the same steps on the second iPhone.

### Step 3: Test Sync

1. On Phone 1, tap the ⚙️ button to access admin
2. Enter password: `Hilife69!`
3. Add a test holiday
4. On Phone 2, refresh the app (pull down)
5. The holiday should appear on both phones!

---

## 🎨 Creating App Icons (Optional)

The app works without custom icons, but for a polished look:

### Quick Method:
1. Go to [favicon.io](https://favicon.io/emoji-favicons/)
2. Choose the ✈️ or 🏝️ emoji
3. Download the PNG files
4. Rename them to `icon-192.png` and `icon-512.png`
5. Upload to your GitHub repository

### Custom Design:
1. Create 192x192px and 512x512px PNG images
2. Use your favorite design tool
3. Save as `icon-192.png` and `icon-512.png`
4. Upload to your GitHub repository

---

## 🔐 Security Notes

### Current Setup:
- ✅ Admin page protected by password
- ✅ HTTPS encryption (automatic with GitHub Pages)
- ✅ Firebase credentials safe to be public (normal practice)
- ⚠️ Firestore in test mode (anyone with link can read/write)

### Optional: Enhanced Security

If you want to restrict database access to only authenticated users:

1. In Firebase Console, go to Authentication
2. Enable "Email/Password" provider
3. Create user accounts
4. Update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /holidays/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Update the app to use Firebase Authentication (requires code changes)

For your use case (just two phones), the password protection is probably sufficient.

---

## 🎯 How to Use

### Adding a Holiday:

1. Open the app
2. Tap the ⚙️ (settings) button
3. Enter password: `Hilife69!`
4. Tap **"Add New Holiday"**
5. Fill in the details:
   - Destination (required)
   - Outbound flight details
   - Return flight details
   - Hotels (can add multiple)
   - Activities/Transport (can add multiple)
   - Other notes
6. Tap **"Save Holiday"**

### Viewing Holidays:

- Main screen shows all holidays
- Upcoming holidays show countdown in days
- Current holidays (you're on them now!) show days remaining
- Past holidays are dimmed
- Tap any holiday card to see full details

### Editing/Deleting:

1. Go to admin page (⚙️ button)
2. Scroll to "Existing Holidays"
3. Tap **"Edit"** or **"Delete"**

---

## 🐛 Troubleshooting

### "Firebase not configured" message:
- Check that you updated `config.js` with real Firebase credentials
- Make sure you committed the changes to GitHub
- Wait 2-3 minutes for GitHub Pages to redeploy

### Holidays not syncing between phones:
- Both phones must be connected to internet
- Try refreshing the app (pull down on main screen)
- Check Firebase Console → Firestore Database to see if data is there
- Make sure both phones are accessing the same URL

### Can't add holidays:
- Check Firebase Firestore is enabled
- Check security rules are set correctly
- Look for errors in browser console (Settings → Safari → Advanced → Web Inspector)

### App not installing on iPhone:
- Must use Safari browser (not Chrome)
- Make sure you're on the correct URL
- Try clearing Safari cache and trying again

### Icons not showing:
- Upload `icon-192.png` and `icon-512.png` to your repository
- Delete the app from home screen and re-add it

---

## 📝 Changing the Password

To change the admin password:

1. Edit `config.js` in GitHub
2. Change this line:
```javascript
export const ADMIN_PASSWORD = "YourNewPassword";
```
3. Commit changes
4. Wait for GitHub Pages to rebuild (1-2 minutes)
5. Old sessions will be logged out automatically

---

## 🔄 Updating the App

If you want to modify the design or add features:

1. Edit files directly in GitHub (click pencil icon)
2. Or download files, edit locally, and re-upload
3. Commit changes
4. GitHub Pages auto-deploys in 1-2 minutes
5. Users may need to refresh or close/reopen the app

---

## 💡 Tips

- **Backup your data**: Holidays are stored in Firebase. Export occasionally by:
  - Firebase Console → Firestore → Export/Import
  
- **Offline use**: The app works offline thanks to PWA caching
  - Changes sync automatically when back online
  
- **Date format**: Use your browser's date picker for consistency
  
- **Multiple hotels**: Add as many hotels as you need for each holiday
  
- **Transport notes**: Use activities section for trains, car rentals, etc.

---

## 📞 Support

If you run into issues:

1. Check the Troubleshooting section above
2. Look at browser console for errors
3. Check Firebase Console for data
4. Verify all files uploaded correctly to GitHub

---

## 🎉 You're All Set!

Your Hart's Holidays app is now live and ready to track all your adventures! 

**Your app URL:** `https://YOUR_USERNAME.github.io/harts-holidays/`

Enjoy your holidays! ✈️🏝️

---

## 📄 License

This is a custom app for personal use. Feel free to modify as needed!
