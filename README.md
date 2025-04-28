# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

---

## 📱 About the App

**NOMark** is a cross-platform mobile and web application for managing classroom attendance. It streamlines the attendance process for both teachers and students through features like:

- ✅ QR code scanning for check-in
- ✅ Role-based views for teachers and students
- ✅ Auto-generated class sessions with time validation
- ✅ Attendance tracking with visual progress indicators
- ✅ Manual overrides for late/absent status
- ✅ Join codes, meeting times, and reminder banners
- ✅ Exportable and editable session records
- ✅ Fully functional on web and Android (APK export supported)

This app is built using **React Native with Expo**, and uses **file-based routing** and **custom components** for clean structure and maintainability.

---

## 🚀 Get started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

You'll then see options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

You can start developing by editing files inside the `app` directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

---

## 📁 Project structure

```
.
├── app/                  # Main app code with file-based routes
├── components/           # Reusable components (e.g. AttendanceGauge, ClassCard)
├── assets/               # Fonts, images, etc.
├── styles/               # Shared styles
├── backend/              # (optional) API handlers or local backend integration
├── README.md
└── package.json
```

---

## 🧪 Useful scripts

- **Reset project to blank app folder**

  ```bash
  npm run reset-project
  ```

  Moves starter code to `app-example` and creates a blank `app/` directory.

- **Clean cache (if things break)**

  ```bash
  npx expo start -c
  ```

---

## 🔐 Environment setup

To use environment variables, create a `.env` file and install `expo-constants` or `react-native-dotenv` if needed.

```env
API_URL=https://your-api.com
```

---

## 📦 Building the app

- **Android APK**:

  ```bash
  eas build --platform android
  ```

- **Web static build**:

  ```bash
  expo export
  ```

---

## 📚 Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [React Native docs](https://reactnative.dev/)

---

## 👥 Join the community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
