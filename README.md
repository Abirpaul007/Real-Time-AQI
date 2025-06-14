<img src="https://img.icons8.com/color/96/air-quality.png" height="60"/>

#  Real-Time AQI Monitor

> A cross-platform React Native app with a lightweight backend for live Air Quality Index and Pollution Parameter tracking.

![React Native](https://img.shields.io/badge/React_Native-⚛️-blue.svg) ![Node.js](https://img.shields.io/badge/Node.js-green) ![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🚀 Overview

Real-Time AQI Monitor fetches and displays air quality levels for your current location. 🏙️ The React Native app calls the backend service to retrieve live AQI data.

**Key Features:**

- 📍 Auto-detects device location to show relevant AQI
- 🔴🟢 Dynamic color-coded indicators (Good to Hazardous)
- 🗓️ Shows timestamp of the last update
- 🔧 Easy to configure and extend
- 📊 History Chart of AQI of that loaction in **Graph**

---

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

This project supports 


- [Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOSr](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### 🔧 Update Your IP Address

Before running the app, **make sure to replace the hardcoded IPv4 address** in your frontend API calls with **your own local IPv4 address** (usually something like `192.168.x.x`):

```js
// Example in frontend API call (React Native)
const BASE_URL = "http://YOUR-IPV4-ADDRESS:5000"; // 🔁 Replace with your system's IPv4 address
```
 How to Find Your IPv4 Address:
Windows:
Open Command Prompt and type:

```bash

ipconfig
```
Look for IPv4 Address under your network adapter.

Mac/Linux:
Open Terminal and type:

```bash
ifconfig
```
<p float="left">
  <img src="HOME.JPG" width="45%" />
  <img src="APPHIS.JPG" width="45%" />
</p>

