# Welcome to your Expo app 👋

## IMPORTANT
It might seem like there is a weird blend between the api calls and styles. Some pages use api.ts calls and styles.ts styles and some have the calls and styles written in the file or in line. 
This is due to some errors and bugs we experienced when making the application. Long story short our initial file tree strucure was no where near what it should've been and as we 
moved things around certain things broke. To deal with this we had one member focus on fixing the file tree (ended up being a real easy fix regarding _layout.tsx but our inexperience
with react/expo made it 10x harder) while the others continued to add features, using in file api calls and stlyes. While it would be a relatively easy fix to combine api calls to api.ts
and styles to styles.ts the project deadline was approaching and since everything worked we did not want to chance breaking things again so we kept it as is.
It might not be the best practice but as the saying goes if it ain't broke don't fix it.

---

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

   ```
   run "npm install" in the terminal
   ```

2. **Start the app**

   ```
   run "npx expo start" or "npm start" in the terminal
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
├───── (tabs)/            # Teacher and Student Pages
├── components/           # Reusable components (e.g. AttendanceGauge, ClassCard)
├── assets/               # Fonts, images, etc.
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

---

## 🔗 Additional Resources and References

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo SecureStore (Token Storage)](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo Camera (QR Scanning)](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Modal (UI popups)](https://reactnative.dev/docs/modal)
- [Node.js Express (Backend Server)](https://expressjs.com/)
- [bcrypt.js (Password Hashing)](https://www.npmjs.com/package/bcrypt)
- [JWT (Authentication)](https://jwt.io/)
- [MySQL2 Node.js Driver](https://github.com/sidorares/node-mysql2)
- [MDN Web Docs - URL.createObjectURL (CSV Export)](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [JSZip Documentation (ZIP Export)](https://stuk.github.io/jszip/)

These tools and libraries were referenced throughout development to ensure security, reliability, and functionality across the NOMark application.

