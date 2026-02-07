# 🔥 Firebase Setup - Detailed Visual Guide

This guide walks you through setting up Firebase step-by-step with what you'll see on each screen.

---

## Part 1: Create Firebase Project

### Step 1: Go to Firebase Console
1. Open browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account
3. You'll see the Firebase Console welcome screen

### Step 2: Create New Project
1. Click the **"Create a project"** or **"Add project"** button
2. You'll see **"Create a project"** dialog

### Step 3: Project Name
- **Screen says:** "Let's start with a name for your project"
- **Enter:** `harts-holidays` (or any name you prefer)
- **Note:** You'll see a Project ID below (like `harts-holidays-xxxxx`)
- **Click:** Continue

### Step 4: Google Analytics (Optional)
- **Screen says:** "Enable Google Analytics for this project?"
- **Choose:** Turn OFF the toggle (you don't need analytics)
  - OR leave it ON if you want usage statistics (your choice)
- **Click:** Create project

### Step 5: Wait for Creation
- **Screen shows:** "Your new project is ready!"
- Progress bar will complete
- **Click:** Continue

---

## Part 2: Add Web App

### Step 1: Add Firebase to Your Web App
- **You'll see:** Firebase project dashboard
- **Look for:** Icons for iOS, Android, Web, and Unity
- **Click:** The **Web icon** (looks like: `</>`)

### Step 2: Register App
- **Screen says:** "Add Firebase to your web app"
- **App nickname:** Enter `Hart's Holidays Web`
- **Firebase Hosting:** Check the box (optional but recommended)
- **Click:** Register app

### Step 3: Copy Configuration
- **Screen shows:** Firebase SDK configuration code
- **You'll see something like:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "harts-holidays-xxxxx.firebaseapp.com",
  projectId: "harts-holidays-xxxxx",
  storageBucket: "harts-holidays-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**IMPORTANT:** 
- Copy these values somewhere safe (Notepad, Notes app, etc.)
- You'll need them in a few minutes
- **Click:** Continue to console

---

## Part 3: Enable Firestore Database

### Step 1: Navigate to Firestore
- **Look at left sidebar** in Firebase Console
- **Click:** "Build" section
- **Click:** "Firestore Database"

### Step 2: Create Database
- **You'll see:** "Cloud Firestore" page
- **Click:** "Create database" button

### Step 3: Choose Security Mode
- **Screen says:** "Start in production mode or test mode?"
- **Choose:** "Start in test mode"
  - This allows read/write access for 30 days
  - We'll set proper rules in the next step
- **Click:** Next

### Step 4: Set Location
- **Screen says:** "Set your Cloud Firestore location"
- **Choose:** Closest location to you:
  - Europe: `eur3 (europe-west)`
  - US East: `us-east1`
  - US Central: `us-central1`
  - Asia: `asia-southeast1`
- **Note:** You can't change this later
- **Click:** Enable

### Step 5: Wait for Creation
- Progress bar shows "Creating Cloud Firestore..."
- Takes about 30 seconds
- **You'll see:** Empty database with tabs: Data, Rules, Indexes, Usage

---

## Part 4: Set Security Rules

### Step 1: Go to Rules Tab
- **Click:** The "Rules" tab at the top
- **You'll see:** Default security rules

### Step 2: Replace Rules
- **Delete everything** in the rules editor
- **Paste this:**

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

### Step 3: Publish Rules
- **Click:** "Publish" button
- **You'll see:** "Rules updated successfully"

**What this does:**
- Allows anyone to read/write to the `holidays` collection
- Your admin password protects the admin interface
- For extra security, you could add authentication later

---

## Part 5: Copy Your Configuration Values

You need these 6 values from Step 2.3 above:

```
1. apiKey: "AIzaSy..."
2. authDomain: "harts-holidays-xxxxx.firebaseapp.com"
3. projectId: "harts-holidays-xxxxx"
4. storageBucket: "harts-holidays-xxxxx.appspot.com"
5. messagingSenderId: "123456789012"
6. appId: "1:123456789012:web:xxxxx"
```

### Where to Find Them Again:
1. In Firebase Console, click the ⚙️ (Settings) icon
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click on your web app
5. Copy the config values

---

## Part 6: Add Config to Your App

### Option A: Edit on GitHub (Easiest)

1. Go to your GitHub repository
2. Click on `config.js` file
3. Click the pencil ✏️ icon (Edit)
4. Replace the placeholder values:

**BEFORE:**
```javascript
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**AFTER:**
```javascript
export const firebaseConfig = {
    apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "harts-holidays-xxxxx.firebaseapp.com",
    projectId: "harts-holidays-xxxxx",
    storageBucket: "harts-holidays-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

5. Keep the password line as-is:
```javascript
export const ADMIN_PASSWORD = "Hilife69!";
```

6. Scroll down and click **"Commit changes"**
7. Wait 1-2 minutes for GitHub Pages to rebuild

### Option B: Edit Locally

1. Open `config.js` in your text editor
2. Replace the placeholder values with your Firebase config
3. Save the file
4. Upload to GitHub
5. Wait for deployment

---

## Verification

### Test Firebase Connection:

1. Open your app: `https://YOUR_USERNAME.github.io/harts-holidays/`
2. Open browser developer tools (F12)
3. Look at Console tab
4. If you see "Firebase initialized" or no errors → Success! ✅
5. If you see "Firebase not configured" → Check your config.js

### Test Database Write:

1. In your app, tap ⚙️ button
2. Enter password: `Hilife69!`
3. Add a test holiday
4. Go to Firebase Console → Firestore Database → Data tab
5. You should see a `holidays` collection with your test holiday ✅

---

## Common Issues

### "Permission denied" errors
- **Check:** Firestore rules are set correctly (Part 4)
- **Check:** Rules are published (green checkmark)

### "Firebase not configured" 
- **Check:** config.js has real values (not "YOUR_API_KEY")
- **Check:** Values copied correctly (no extra spaces)
- **Check:** File was committed to GitHub
- **Wait:** 2 minutes for GitHub Pages to rebuild

### App works but doesn't sync
- **Check:** Internet connection on both phones
- **Check:** Both phones using same URL
- **Check:** Firebase Console shows data in Firestore
- **Try:** Refresh the app (pull down on main screen)

### Database not showing in Firebase
- **Check:** You enabled Firestore (not Realtime Database)
- **Check:** Location was selected during setup
- **Try:** Create database again if needed

---

## Security Tips

### Current Setup (Good for Personal Use):
- ✅ Admin password protects editing
- ✅ HTTPS encryption via GitHub Pages
- ✅ Firebase rules allow read/write to holidays only
- ✅ No sensitive payment or personal data stored

### Optional Enhanced Security:
- Enable Firebase Authentication
- Require sign-in to read/write
- Set up user accounts
- Add role-based permissions

For just 2 personal phones, the password is sufficient!

---

## Firebase Costs

### Free Tier Includes:
- **Storage:** 1 GB
- **Reads:** 50,000 per day
- **Writes:** 20,000 per day
- **Deletes:** 20,000 per day

### Your Usage:
- Each holiday = ~1 KB
- 100 holidays = 100 KB
- Reading holidays = 1 read per holiday
- You'll use less than 1% of the free tier! 💯

**Cost: $0** for personal use like this! 🎉

---

## Maintenance

### Backup Your Data:

1. Firebase Console → Firestore Database
2. Click three dots ⋮ menu
3. Click "Export to Cloud Storage"
4. Set up a Cloud Storage bucket (free tier)
5. Export periodically for backup

### Monitor Usage:

1. Firebase Console → Firestore Database
2. Click "Usage" tab
3. See reads, writes, deletes per day
4. Monitor to stay within free tier

### View Your Data:

1. Firebase Console → Firestore Database
2. Click "Data" tab
3. See all holidays in the `holidays` collection
4. Can manually edit or delete if needed

---

## Next Steps

Once Firebase is set up:

1. ✅ Firebase project created
2. ✅ Web app registered  
3. ✅ Firestore database enabled
4. ✅ Security rules set
5. ✅ Config values copied to app
6. → Continue with GitHub setup!

---

**You're now ready for Part 2 of the setup (GitHub Pages)!** 🚀

See README.md for the complete deployment guide.
