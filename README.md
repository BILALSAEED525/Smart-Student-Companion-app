<div align="center">

# 📚 Smart Student Companion

**A feature-rich mobile app built to help students stay organized, informed, and productive.**

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

</div>

---

## ✨ Overview

Smart Student Companion is a cross-platform mobile application designed for students who want everything in one place — notes, live weather, trending news, and personalized settings — all behind a secure login.

---

## 🚀 Features

### 🔐 Authentication
- Secure **email & password login** and **registration**
- Persistent sessions — stay logged in across app restarts
- One-tap **logout** from the Home screen

### 📝 Notes
- Quickly **create notes** with a title and description
- Notes are **synced in real-time** to the cloud — accessible from any device
- **Delete** notes you no longer need
- Each note is stamped with the **exact time it was created**

### 🌤️ Explore
- **Live weather** for your current city — temperature, condition, and cloud cover at a glance
- **Trending news feed** — browse popular stories with their like counts, updated in real time

### ⚙️ Settings & Personalization
- Set your **display name** and **favorite subject**
- Toggle **Dark Mode** on or off instantly
- **Save** your preferences locally so they're remembered on every launch
- **Clear** all saved data with one tap

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Local Storage | AsyncStorage |
| Icons | Lucide React Native |

---

## 📂 Project Structure

```
smart-student-companion/
│
├── App.js                    # Entry point — auth flow & navigation
│
└── src/
    ├── config/
    │   └── firebase.js       # Firebase app initialization
    │
    ├── screens/
    │   ├── LockScreen.js     # Login
    │   ├── SignUpScreen.js   # Registration
    │   ├── HomeScreen.js     # Welcome + logout
    │   ├── NotesScreen.js    # Notes (Firestore CRUD)
    │   ├── ExploreScreen.js  # Weather + news
    │   └── SettingsScreen.js # Preferences + dark mode
    │
    └── components/
        └── NavItem.js        # Bottom nav tab component
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- A [Firebase](https://firebase.google.com/) project with Authentication and Firestore enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/smart-student-companion.git
cd smart-student-companion

# Install dependencies
npm install

# Start the app
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `a` / `i` to open on an Android / iOS emulator.

---

## 🔥 Firebase Configuration

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** sign-in under **Authentication**
3. Create a **Firestore** database
4. Paste your config into `src/config/firebase.js`:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 🌙 Dark Mode

Flip the **Dark Theme** toggle in Settings to switch the entire UI to a dark color scheme. Your preference is saved locally and automatically restored the next time you open the app.

---

## 📄 License

MIT License — free to use, modify, and distribute.
